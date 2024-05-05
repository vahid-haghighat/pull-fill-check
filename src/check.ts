import { Root } from 'mdast'
import { remark } from 'remark'

/**
 * Checks to see if the PR template is filled.
 * @param template The content of the template.
 * @param fromPr The pr body the pr author filled
 * @returns {Promise<void>}
 */
export async function check(template: string, fromPr: string): Promise<void> {
  const parsedTemplate = parse(template)
  const parsedFromPr = parse(fromPr)

  if (parsedFromPr.length !== parsedTemplate.length) {
    throw new Error('Please fill the template and do not add extra sections')
  }

  for (let index = 0; index < parsedTemplate.length; index++) {
    const templateChild = parsedTemplate[index]
    const fromPrChild = parsedFromPr[index]

    if (templateChild.ignore) {
      continue
    }

    if (templateChild.title !== fromPrChild.title) {
      throw new Error('Please fill the template and do not add extra sections')
    }

    if (
      templateChild.content === fromPrChild.content ||
      fromPrChild.content.length === 0
    ) {
      throw new Error(
        `The PR template should be filled completely. This section is not filled: ${fromPrChild.content}`
      )
    }
  }
}

type section = {
  title: string
  content: string
  ignore: boolean
}

function parse(md: string): section[] {
  const processor = remark()
  const parsed = processor.parse(md)

  const result: section[] = [
    {
      title: '',
      content: '',
      ignore: true
    }
  ]

  for (const child of parsed.children) {
    const content = processor.stringify(child as unknown as Root).trim()
    switch (child.type) {
      case 'heading':
        result.push({
          title: content,
          content: '',
          ignore: false
        })
        break
      default:
        result[result.length - 1].content += `${
          result[result.length - 1].content.length > 0 ? '\n' : ''
        }${content}`
        result[result.length - 1].ignore = false
    }
  }

  return result
}
