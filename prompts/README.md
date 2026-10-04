# Creative briefs

Keep new briefs in `prompts/pending/`. Pass the selected file with `--prompt`; the runner never moves or overwrites it. Older WordPress briefs and completed prompts remain historical references. Static run instructions supersede old PHP/build requirements while retaining business/design intent.

Describe business identity, audience, content, navigation, page layouts, visual direction, colors, typography, accessibility, interactions and documentation. Never include secrets or private customer data.

For local-stage coverage use headings such as `Business Identity`, `Header and Navigation`, `Pages to Build`, `Visual Design Direction`, `Functionality`, and `Supporting Documentation`. The six static stages validate ownership before model invocation. `012-common-ground-static.md` is a complete focused example; `000-testing.md` remains the familiar larger creative brief.

Approved local imagery is selected with `--asset-catalog assets/manifests/<catalog>.json` before generation. The runner supplies its manifest and exact paths. Models must not acquire images or invent licensing. Briefs should describe desired imagery, not download instructions.

The default product is static HTML/CSS/JavaScript under docs. WordPress conversion happens only after selecting a static sample and running the explicit conversion command. Reports live under `reports/static/`, not public docs.
