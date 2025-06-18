import sphinx.application
import sphinx.domains.index
from pathlib import Path

__version__="unknown"
def __init_version():
    global __version__
    try:
        assert '.' not in __name__
        from importlib.metadata import version
        __version__ = version(__name__)
    except:
        pass
__init_version()
THEME_PATH = (Path(__file__).parent / "themes" / "ksphinx").resolve()


def setup(app: sphinx.application.Sphinx):
    """Entry point for sphinx theming."""
    app.require_sphinx("6.0")
    app.add_js_file("ksphinx.js")
    app.add_js_file("highlight.min.js")
    app.add_html_theme("ksphinx", str(THEME_PATH))
    app.config.templates_path.append(str(THEME_PATH / "templates"))
    app.config.html_context['ksphinx_version'] = __version__
    app.config.html_static_path.append(str(THEME_PATH / "static"))
