# Repository Guidelines

## Project Structure

This is Arthur Malumian's personal website and blog, built with Astro. Routes live in `src/pages/`, reusable Astro components in `src/components/`, layouts in `src/layouts/`, and shared CSS in `src/styles/`.

Write posts in `src/content/blog/` as Markdown or MDX. Use descriptive, kebab-case filenames such as `my-developer-workflow-on-macos.mdx` and include `title` and `date` frontmatter as defined in `src/content.config.ts`. Store images processed by Astro in `src/assets/` and files served directly, such as fonts, videos, and PDFs, in `public/`.

## Build and Development Commands

- `npm ci` installs the dependencies from the lockfile.
- `npm run dev` starts the Astro development server with live reload.
- `npm run lint` checks `src/` with ESLint. `npm run lint:fix` applies available fixes.
- `npm run format` formats `src/` with Prettier and its Astro plugin.
- `npm run build` generates the static site in `dist/`. Run `npm run preview` afterward to serve that build locally.

## Coding Style

Use two-space indentation, single quotes, and semicolons in JavaScript and TypeScript. Name Astro components and layouts in PascalCase, such as `FormattedDate.astro`. Group imports with blank lines and use `@/` to reference modules under `src/` where appropriate. The Husky pre-commit hook runs Prettier and ESLint on staged Astro, TypeScript, and CSS files through lint-staged.

## Testing

Run lint and build before opening a pull request. Functional checks are manual. Preview the affected routes and verify links and media. For blog changes, check the post page and its entry in the blog index. For layout changes, check narrow and wide viewports.

## Commits and Pull Requests

Follow the short, imperative commit subjects in Git history, such as `Add pagination` or `Update favicons`. In the pull request, summarize the change, list the checks you ran, link any related issue, and add screenshots for visible changes.
