import * as core from '@actions/core'
import * as github from '@actions/github'
import * as fs from 'fs'
import { check } from './check.js'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export default async function run(): Promise<void> {
  try {
    if (!github.context.issue.number) {
      core.setFailed('Cannot read the PR information')
      return
    }

    const githubToken =
      core.getInput('token') || (process.env.GITHUB_TOKEN as string)
    const templateAddress: string = core.getInput('template-address')

    if (!githubToken) {
      core.setFailed('The token is not passed in.')
      return
    }

    const client = github.getOctokit(githubToken)

    core.debug(`Reading the PR template from ${templateAddress} ...`)
    const template = fs.readFileSync(templateAddress).toString()

    const { data } = await client.rest.pulls.get({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.issue.number
    })

    if (!data.body) {
      core.setFailed('Cannot read the body of the pull request')
      return
    }

    await check(template, data.body)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error)
  }
}
