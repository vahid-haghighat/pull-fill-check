# Pull Request Template Checker

This GitHub action checks that a pull request template has been properly filled out by the author of the pull request.

## Usage

To use this action, you must have a pull request template defined somewhere in your repository.

Then in your GitHub workflow, use the action like this:

```yaml
- uses: vahid-haghighat/pull-fill-check@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    template-address: path/to/template
```

`template-address` is optional and if not passed in, it defaults to `./.github/pull_request_template.md`.

This will read the pull request template from `template-address` and the actual content submitted in the pull request body and then will validate that the pull request body has content corresponding to each section in the template.

## How it Works
The action does the following:
1. Parses the template and PR body into sections using `remark`.
2. Compares the sections to make sure PR has same sections as template
3. Checks that each section in PR body has content
4. Throws error if sections are missing or empty

So it ensures:
- PR has same sections/structure as template
- PR has content filled out for each section
- Your standard PR template is properly used.