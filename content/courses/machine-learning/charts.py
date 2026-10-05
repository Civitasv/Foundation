"""只负责图表样式；教学计算保留在各讲的 Python 源码中。"""


def line(rows, x, y, series=None, title="", log_y=False):
    encoding = {
        "x": {"field": x, "type": "quantitative", "title": x},
        "y": {"field": y, "type": "quantitative", "title": y,
              "scale": {"type": "log"} if log_y else {"zero": False}},
        "tooltip": [{"field": key} for key in rows[0]],
    }
    if series:
        encoding["color"] = {"field": series, "type": "nominal", "title": series}
    return {
        "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
        "title": title, "width": 440, "height": 230,
        "data": {"values": rows}, "mark": {"type": "line", "point": True},
        "encoding": encoding,
        "config": {"font": "sans-serif", "axis": {"labelFontSize": 12, "titleFontSize": 13}},
    }


def scatter(rows, x, y, category, title=""):
    spec = line(rows, x, y, category, title)
    spec["mark"] = {"type": "point", "filled": True, "size": 130}
    return spec
