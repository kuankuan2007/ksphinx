import sphinx.application
import sphinx.domains.index
from pathlib import Path

THEME_PATH = (Path(__file__).parent / "themes" / "ksphinx").resolve()


def setup(app: sphinx.application.Sphinx):
    """Entry point for sphinx theming."""
    app.require_sphinx("6.0")
    app.add_js_file("ksphinx.js")
    app.add_js_file("highlight.min.js")
    app.add_html_theme("ksphinx", str(THEME_PATH))
