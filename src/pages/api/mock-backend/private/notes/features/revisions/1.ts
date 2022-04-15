/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { HttpMethod, respondToMatchingRequest } from '../../../../../../../handler-utils/respond-to-matching-request'
import type { RevisionDetails } from '../../../../../../../api/revisions/types'

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
  respondToMatchingRequest<RevisionDetails>(HttpMethod.GET, req, res, {
    id: 1,
    createdAt: '2021-12-29T17:54:11.000Z',
    patch: '',
    edits: [],
    length: 2788,
    authorUsernames: [],
    anonymousAuthorCount: 4,
    content:
      '---\ntitle: Features\ndescription: Many more features, such wow!\nrobots: noindex\ntags: hedgedoc, demo, react\nopengraph:\n  title: Features\n---\n# Embedding demo\n[TOC]\n\n## some plain text\n\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magnus aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetezur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam _et_ justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\n## MathJax\nYou can render *LaTeX* mathematical expressions using **MathJax**, as on [math.stackexchange.com](https://math.stackexchange.com/):\n\nThe *Gamma function* satisfying $\\Gamma(n) = (n-1)!\\quad\\forall n\\in\\mathbb N$ is via the Euler integral\n\n$$\nx = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.\n$$\n\n$$\n\\Gamma(z) = \\int_0^\\infty t^{z-1}e^{-t}dt\\,.\n$$\n\n> More information about **LaTeX** mathematical expressions [here](https://meta.math.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference).\n\n## Blockquote\n> Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\n> Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\n> [color=red] [name=John Doe] [time=2020-06-21 22:50]\n\n## Slideshare\n{%slideshare mazlan1/internet-of-things-the-tip-of-an-iceberg %}\n\n## Gist\nhttps://gist.github.com/schacon/1\n\n## YouTube\nhttps://www.youtube.com/watch?v=zHAIuE5BQWk\n\n## Vimeo\nhttps://vimeo.com/23237102\n\n## Asciinema\nhttps://asciinema.org/a/117928\n\n## PDF\n{%pdf https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf %}\n\n## Code highlighting\n```javascript=\n\nlet a = 1\n```\n\n## PlantUML\n```plantuml\n@startuml\nparticipant Alice\nparticipant "The **Famous** Bob" as Bob\n\nAlice -> Bob : bye --there--\n... Some ~~long delay~~ ...\nBob -> Alice : ok\nnote left\n  This is **bold**\n  This is //italics//\n  This is ""monospaced""\n  This is --stroked--\n  This is __underlined__\n  This is ~~waved~~\nend note\n\nAlice -> Bob : A //well formatted// message\nnote right of Alice\n This is <back:cadetblue><size:18>displayed</size></back>\n __left of__ Alice.\nend note\nnote left of Bob\n <u:red>This</u> is <color #118888>displayed</color>\n **<color purple>left of</color> <s:red>Alice</strike> Bob**.\nend note\nnote over Alice, Bob\n <w:#FF33FF>This is hosted</w> by <img sourceforge.jpg>\nend note\n@enduml\n```\n\n'
  })
}

export default handler
