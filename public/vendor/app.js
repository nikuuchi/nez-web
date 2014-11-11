﻿var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Debug = {};

var PegNodeShape = (function (_super) {
    __extends(PegNodeShape, _super);
    function PegNodeShape() {
        _super.apply(this, arguments);
    }
    PegNodeShape.prototype.PrepareHTMLContent = function () {
        if (this.Content == null) {
            var div = document.createElement("div");
            this.Content = div;

            div.id = this.NodeView.label;
            div.setAttribute("data-nodelabel", this.NodeView.label);

            if (this.NodeView.label) {
                var h4 = document.createElement("h4");
                h4.textContent = "#" + this.NodeView.label.split("#")[1];
                div.appendChild(h4);
            }
            if (this.NodeView.content) {
                var p = document.createElement("p");
                p.innerText = this.NodeView.content.trim();
                div.appendChild(p);
            }
            this.UpdateHtmlClass();
        }
    };

    PegNodeShape.prototype.PrepareSVGContent = function () {
        _super.prototype.PrepareSVGContent.call(this);
        this.BodyRect = VisModelJS.Utils.createSVGElement("rect");
        this.ShapeGroup.appendChild(this.BodyRect);
        if (this.NodeView.folded) {
            this.ShapeGroup.appendChild(PegNodeShape.ModuleSymbolMaster.cloneNode());
        }
    };

    PegNodeShape.prototype.FitSizeToContent = function () {
        this.BodyRect.setAttribute("width", this.GetNodeWidth().toString());
        this.BodyRect.setAttribute("height", this.GetNodeHeight().toString());
        if (this.NodeView.childNodes == null && !this.NodeView.folded) {
            var x = (this.GetNodeWidth() / 2).toString();
            var y = (this.GetNodeHeight() + 20).toString();
        }
    };

    PegNodeShape.prototype.UpdateHtmlClass = function () {
        this.Content.className = "node node-peg";
    };
    PegNodeShape.ModuleSymbolMaster = (function () {
        var Master = VisModelJS.Utils.createSVGElement("rect");
        Master.setAttribute("width", "80px");
        Master.setAttribute("height", "13px");
        Master.setAttribute("y", "-13px");
        return Master;
    })();
    return PegNodeShape;
})(VisModelJS.Shape);

var PegShapeFactory = (function (_super) {
    __extends(PegShapeFactory, _super);
    function PegShapeFactory() {
        _super.apply(this, arguments);
    }
    PegShapeFactory.prototype.CreateShape = function (Node) {
        return new PegNodeShape(Node);
    };
    return PegShapeFactory;
})(VisModelJS.ShapeFactory);

var sampleData = {
    tag: "JSON",
    value: [
        {
            tag: "KeyValue",
            value: [
                {
                    tag: "String",
                    value: "name"
                },
                {
                    tag: "String",
                    value: "taro"
                }
            ]
        },
        {
            tag: "KeyValue",
            value: [
                {
                    tag: "String",
                    value: "id"
                },
                {
                    tag: "Integer",
                    value: "1"
                }
            ]
        },
        {
            tag: "KeyValue",
            value: [
                {
                    tag: "String",
                    value: "friends"
                },
                {
                    tag: "List",
                    value: [
                        {
                            tag: "String",
                            value: "yamada"
                        },
                        {
                            tag: "String",
                            value: "kondo"
                        }
                    ]
                }
            ]
        }
    ]
};

var createNodeViewFromP4DJson = function () {
    var i = 0;
    return function (json) {
        var node = new VisModelJS.TreeNodeView();
        node.label = (i++).toString() + "#" + json.tag;
        if (json.value) {
            if (json.value.constructor.name == "Array") {
                json.value.forEach(function (json) {
                    node.appendChild(createNodeViewFromP4DJson(json));
                });
            } else {
                node.content = json.value.toString();
            }
        }
        return node;
    };
}();

window.onload = function () {
    // IE dose not have Function#name. but it is needed for imprement 'instanceof'
    if (!Function.prototype.name) {
        Object.defineProperty(Function.prototype, "name", {
            get: function () {
                return this.toString().replace(/^\s*function\s*([^\(]*)[\S\s]+$/im, '$1');
            }
        });
    }

    //Browser detection
    //var UA = VisModelJS.Utils.UserAgant;
    //if (!UA.isBlink() && !UA.isWebkit() && !UA.isGecko()) {
    //    alert('Not supported browser. Use Chrome/Safari/FireFox.');
    //    return;
    //}
    VisModelJS.ShapeFactory.SetFactory(new PegShapeFactory());

    var root = document.getElementById("visualOutput");
    var panel = new VisModelJS.VisualModelPanel(root);

    var TopNode = createNodeViewFromP4DJson(sampleData);

    panel.InitializeView(TopNode);
    panel.Draw();
    panel.Viewport.camera.setPositionAndScale(TopNode.centerGx, TopNode.centerGy + panel.Viewport.areaHeight / 3, 1);
    panel.addEventListener("dblclick", function (event) {
        var node = event.node;
        node.folded = !node.folded;
        panel.Draw(panel.TopNodeView.label, 300, node);
    });
};
//# sourceMappingURL=app.js.map
