/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getGlobalState, store } from '../index'
import type { HistoryExportJson, RemoveEntryAction, SetEntriesAction, UpdateEntryAction, V1HistoryEntry } from './types'
import { HistoryActionType } from './types'
import { download } from '../../components/common/download/download'
import { DateTime } from 'luxon'
import {
  deleteRemoteHistory,
  deleteRemoteHistoryEntry,
  getRemoteHistory,
  setRemoteHistoryEntries,
  updateRemoteHistoryEntryPinStatus
} from '../../api/history'
import { addRemoteOriginToHistoryEntry, historyEntryToHistoryEntryPutDto } from '../../api/history/dto-methods'
import { Logger } from '../../utils/logger'
import type { HistoryEntry, HistoryEntryWithOrigin } from '../../api/history/types'
import { HistoryEntryOrigin } from '../../api/history/types'
import { showErrorNotification } from '../ui-notifications/methods'

const log = new Logger('Redux > History')

/**
 * Sets the given history entries into the current redux state and updates the local-storage.
 * @param entries The history entries to set into the redux state.
 */
export const setHistoryEntries = (entries: HistoryEntryWithOrigin[]): void => {
  store.dispatch({
    type: HistoryActionType.SET_ENTRIES,
    entries
  } as SetEntriesAction)
  storeLocalHistory()
}

/**
 * Imports the given history entries into redux state and local-storage and remote based on their associated origin label.
 * @param entries The history entries to import.
 */
export const importHistoryEntries = (entries: HistoryEntryWithOrigin[]): Promise<unknown> => {
  setHistoryEntries(entries)
  return storeRemoteHistory()
}

/**
 * Deletes all history entries in the redux, local-storage and on the server.
 */
export const deleteAllHistoryEntries = (): Promise<unknown> => {
  store.dispatch({
    type: HistoryActionType.SET_ENTRIES,
    entries: []
  } as SetEntriesAction)
  storeLocalHistory()
  return deleteRemoteHistory()
}

/**
 * Updates a single history entry in the redux.
 * @param noteId The note id of the history entry to update.
 * @param newEntry The modified history entry.
 */
export const updateHistoryEntryRedux = (noteId: string, newEntry: HistoryEntry): void => {
  store.dispatch({
    type: HistoryActionType.UPDATE_ENTRY,
    noteId,
    newEntry
  } as UpdateEntryAction)
}

/**
 * Updates a single history entry in the local-storage.
 * @param noteId The note id of the history entry to update.
 * @param newEntry The modified history entry.
 */
export const updateLocalHistoryEntry = (noteId: string, newEntry: HistoryEntry): void => {
  updateHistoryEntryRedux(noteId, newEntry)
  storeLocalHistory()
}

/**
 * Removes a single history entry for a given note id.
 * @param noteId The note id of the history entry to delete.
 */
export const removeHistoryEntry = async (noteId: string): Promise<void> => {
  const entryToDelete = getGlobalState().history.find((entry) => entry.identifier === noteId)
  if (entryToDelete && entryToDelete.origin === HistoryEntryOrigin.REMOTE) {
    await deleteRemoteHistoryEntry(noteId)
  }
  store.dispatch({
    type: HistoryActionType.REMOVE_ENTRY,
    noteId
  } as RemoveEntryAction)
  storeLocalHistory()
}

/**
 * Toggles the pinning state of a single history entry.
 * @param noteId The note id of the history entry to update.
 */
export const toggleHistoryEntryPinning = async (noteId: string): Promise<void> => {
  const state = getGlobalState().history
  const entryToUpdate = state.find((entry) => entry.identifier === noteId)
  if (!entryToUpdate) {
    return Promise.reject(`History entry for note '${noteId}' not found`)
  }
  if (entryToUpdate.pinStatus === undefined) {
    entryToUpdate.pinStatus = false
  }
  entryToUpdate.pinStatus = !entryToUpdate.pinStatus
  if (entryToUpdate.origin === HistoryEntryOrigin.LOCAL) {
    updateLocalHistoryEntry(noteId, entryToUpdate)
  } else {
    await updateRemoteHistoryEntryPinStatus(noteId, entryToUpdate.pinStatus)
    updateHistoryEntryRedux(noteId, entryToUpdate)
  }
}

/**
 * Exports the current history redux state into a JSON file that will be downloaded by the client.
 */
export const downloadHistory = (): void => {
  const history = getGlobalState().history
  history.forEach((entry: Partial<HistoryEntryWithOrigin>) => {
    delete entry.origin
  })
  const json = JSON.stringify({
    version: 2,
    entries: history
  } as HistoryExportJson)
  download(json, `history_${Date.now()}.json`, 'application/json')
}

/**
 * Merges two arrays of history entries while removing duplicates.
 * @param a The first input array of history entries.
 * @param b The second input array of history entries. This array takes precedence when duplicates were found.
 * @return The merged array of history entries without duplicates.
 */
export const mergeHistoryEntries = (
  a: HistoryEntryWithOrigin[],
  b: HistoryEntryWithOrigin[]
): HistoryEntryWithOrigin[] => {
  const noDuplicates = a.filter((entryA) => !b.some((entryB) => entryA.identifier === entryB.identifier))
  return noDuplicates.concat(b)
}

/**
 * Converts an array of local HedgeDoc v1 history entries to HedgeDoc v2 history entries.
 * @param oldHistory An array of HedgeDoc v1 history entries.
 * @return An array of HedgeDoc v2 history entries associated with the local origin label.
 */
export const convertV1History = (oldHistory: V1HistoryEntry[]): HistoryEntryWithOrigin[] => {
  return oldHistory.map((entry) => ({
    identifier: entry.id,
    title: entry.text,
    tags: entry.tags,
    lastVisitedAt: DateTime.fromMillis(entry.time).toISO(),
    pinStatus: entry.pinned,
    origin: HistoryEntryOrigin.LOCAL
  }))
}

/**
 * Refreshes the history redux state by reloading the local history and fetching the remote history if the user is logged-in.
 */
export const refreshHistoryState = async (): Promise<void> => {
  const localEntries = loadLocalHistory()
  if (!getGlobalState().user) {
    setHistoryEntries(localEntries)
    return
  }
  const remoteEntries = await loadRemoteHistory()
  const allEntries = mergeHistoryEntries(localEntries, remoteEntries)
  setHistoryEntries(allEntries)
}

/**
 * Refreshes the history state and shows an error in case of failure.
 */
export const safeRefreshHistoryState = (): void => {
  refreshHistoryState().catch(showErrorNotification('landing.history.error.getHistory.text'))
}

/**
 * Stores the history entries marked as local from the redux to the user's local-storage.
 */
export const storeLocalHistory = (): void => {
  const history = getGlobalState().history
  const localEntries = history.filter((entry) => entry.origin === HistoryEntryOrigin.LOCAL)
  const entriesWithoutOrigin = localEntries.map((entry) => ({
    ...entry,
    origin: undefined
  }))
  window.localStorage.setItem('history', JSON.stringify(entriesWithoutOrigin))
}

/**
 * Stores the history entries marked as remote from the redux to the server.
 */
export const storeRemoteHistory = (): Promise<unknown> => {
  if (!getGlobalState().user) {
    return Promise.resolve()
  }
  const history = getGlobalState().history
  const remoteEntries = history.filter((entry) => entry.origin === HistoryEntryOrigin.REMOTE)
  const remoteEntryDtos = remoteEntries.map(historyEntryToHistoryEntryPutDto)
  return setRemoteHistoryEntries(remoteEntryDtos)
}

/**
 * Loads the local history from local-storage, converts from V1 format if necessary and returns the history entries with a local origin label.
 * @return The local history entries with the origin set to local.
 */
const loadLocalHistory = (): HistoryEntryWithOrigin[] => {
  const localV1Json = window.localStorage.getItem('notehistory')
  if (localV1Json) {
    try {
      const localV1History = JSON.parse(JSON.parse(localV1Json) as string) as V1HistoryEntry[]
      window.localStorage.removeItem('notehistory')
      return convertV1History(localV1History)
    } catch (error) {
      log.error('Error while converting old history entries', error)
      return []
    }
  }

  const localJson = window.localStorage.getItem('history')
  if (!localJson) {
    return []
  }

  try {
    const localHistory = JSON.parse(localJson) as HistoryEntryWithOrigin[]
    localHistory.forEach((entry) => {
      entry.origin = HistoryEntryOrigin.LOCAL
    })
    return localHistory
  } catch (error) {
    log.error('Error while parsing locally stored history entries', error)
    return []
  }
}

/**
 * Loads the remote history and maps each entry with a remote origin label.
 * @return The remote history entries with the origin set to remote.
 */
const loadRemoteHistory = async (): Promise<HistoryEntryWithOrigin[]> => {
  try {
    const remoteHistory = await getRemoteHistory()
    return remoteHistory.map(addRemoteOriginToHistoryEntry)
  } catch (error) {
    log.error('Error while fetching history entries from server', error)
    return []
  }
}
