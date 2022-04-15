/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { Alias, NewAliasDto, PrimaryAliasDto } from './types'
import { PostApiRequestBuilder } from '../common/api-request-builder/post-api-request-builder'
import { PutApiRequestBuilder } from '../common/api-request-builder/put-api-request-builder'
import { DeleteApiRequestBuilder } from '../common/api-request-builder/delete-api-request-builder'

/**
 * Adds an alias to an existing note.
 * @param noteIdOrAlias The note id or an existing alias for a note.
 * @param newAlias The new alias.
 * @return Information about the newly created alias.
 */
export const addAlias = async (noteIdOrAlias: string, newAlias: string): Promise<Alias> => {
  const response = await new PostApiRequestBuilder<Alias, NewAliasDto>('alias')
    .withJsonBody({
      noteIdOrAlias,
      newAlias
    })
    .sendRequest()
  return response.asParsedJsonObject()
}

/**
 * Marks a given alias as the primary one for a note.
 * The former primary alias should be marked as non-primary by the backend automatically.
 * @param alias The alias to mark as primary for its corresponding note.
 * @return The updated information about the alias.
 */
export const markAliasAsPrimary = async (alias: string): Promise<Alias> => {
  const response = await new PutApiRequestBuilder<Alias, PrimaryAliasDto>('alias/' + alias)
    .withJsonBody({
      primaryAlias: true
    })
    .sendRequest()
  return response.asParsedJsonObject()
}

/**
 * Removes a given alias from its corresponding note.
 * @param alias The alias to remove from its note.
 */
export const deleteAlias = async (alias: string): Promise<void> => {
  await new DeleteApiRequestBuilder('alias/' + alias).sendRequest()
}
