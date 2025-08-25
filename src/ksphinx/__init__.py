import sphinx.application
import sphinx.domains.index
from pathlib import Path

from .__pkginfo__ import __version__, __pkgname__

THEME_PATH = (Path(__file__).parent / "themes" / "ksphinx").resolve()


def setup(app: sphinx.application.Sphinx):
    """Entry point for sphinx theming."""
    app.add_js_file("ksphinx.js")
    app.add_js_file("highlight.min.js")
    app.add_html_theme("ksphinx", str(THEME_PATH))
    app.config.html_additional_pages["build-info"] = "build-info.html"
    app.config.html_additional_pages["404"] = "404.html"
    app.config.html_static_path.append(str(THEME_PATH / "static"))
    app.config.templates_path.append(str(THEME_PATH / "templates"))
    app.config.html_context["ksphinx_version"] = __version__
    app.config.html_static_path.append(str(THEME_PATH / "static"))
