/**
 * option说明:
 *  el: 树状图要挂载的容器,必须;
 *  data: 渲染树状图的数据,必须;
 *  direction: 渲染树状图的轴方向,默认为horizontal,可选vertical
 *  padding: 每个节点的padding,默认为10px;
 *  margin: 每个节点之间的margin,默认为20px;
 *  right: 每个节点之间的margin-right,默认为20px;
 *  border: 每个节点的边框样式,默认为1px solid #F7F8FC;
 *  nodeClass: 每个节点的公共类名,非必须,默认为 tree-map-node;
 *  lineWidth: 两个节点之间连线的宽度,默认为1;
 *  lineColor: 两个节点之间连接的颜色,默认为#979797;
 *  arrowWidth: 子节点箭头的宽度,默认为0不显示箭头;
 *  arrowColor: 子节点箭头的颜色,默认为#979797;
 */

// 创建元素的方法
function createEl(tag, domStyle, domClass) {
  let _dom = document.createElement(tag);
  Object.assign(_dom.style, domStyle);
  if (domClass) _dom.className = domClass;
  return _dom;
}

// 创建类
function TreeMap(option) {
  this._option = option;
  this._el = document.querySelector(option.el);
  this._data = option.data;
  this._direction = option.direction === "vertical" ? "vertical" : "horizontal";
  this._margin = option.margin ? option.margin : "20px";
  this._right = option.right ? option.right : 20;
  this._padding = option.padding ? option.padding : "10px";
  this._border = option.border ? option.border : "1px solid #F7F8FC";
  this._nodeClass = option.nodeClass ? option.nodeClass : "tree-map-node";
  this._lineWidth = option.lineWidth ? option.lineWidth : 1;
  this._lineColor = option.lineColor ? option.lineColor : "#F0F1F5";
  this._arrowWidth = option.arrowWidth ? option.arrowWidth : 0;
  this._arrowColor = option.arrowColor ? option.arrowColor : "#F0F1F5";
  this._nodeNum = 0;
  this.init();
}

// 创建节点的方法
TreeMap.prototype.createNode = function (data) {
  let _data = data;
  let marginRight = this._right + Number(_data.length) + 'px';
  let _node = createEl("div", {
    margin: this._margin,
    padding: this._padding,
    border: this._border,
    marginRight,
    boxSizing: "border-box",
    position: "relative",
    flexShrink: 0,
  }, _data.className);
  _node.innerHTML = _data.title;
  _node.setAttribute('len', _data.length || 0);
  return _node;
};

// 初始化
TreeMap.prototype.init = function () {
  if (this._direction === "horizontal") {
    this._data.forEach(item=>{
      this.renderNode_h(item, this._el);
    })
  } else {
    this._data.forEach(item=>{
      this.renderNode_v(item, this._el);
    })}
  this.drawline();
};

// 递归创建节点（水平方向）
TreeMap.prototype.renderNode_h = function (data, wrap, id) {
  // 1.创建父元素节点
  let parentNode = createEl("div", { display: "flex", alignItems: "center", userSelect: "none" });


  // 2.创建当前元素节点
  let currentNode = this.createNode(data);
  currentNode.setAttribute("data-id", ++this._nodeNum);
  currentNode.setAttribute("data-fid", id ? id : 0);
  currentNode.classList.add(this._nodeClass);

  // 3.是否给当前元素节点创建伸缩符
  if (!!data.shrink && !!data.children && data.children.length > 0) {
    let shrink = createEl("div", {
      width: "18px",
      height: "18px",
      textAlign: "center",
      lineHeight: "18px",
      position: "absolute",
      top: "50%",
      right: "-20px",
      cursor: "pointer",
      zIndex: "1",
      fontSize: "12px",
      border: "1px solid #cccccc",
      borderRadius: "50%",
      background: "#ffffff",
      transform: "translateY(-50%)",
    }, 'tree-map-shrink');
    if (!!data.hidden) {
      shrink.textContent = "+";
    } else {
      shrink.textContent = "-";
    }
    let that = this;
    shrink.addEventListener("click", function (data) {
      return function (e) {
        e.stopPropagation();
        data.hidden = !!!data.hidden;
        that.redraw();
      };
    }(data));
    currentNode.appendChild(shrink);
  }

  // 4.创建子元素节点
  if (!!data.children && data.children.length > 0 && !data.hidden) {
    let childrenNode = createEl("div");
    parentNode.appendChild(currentNode);
    parentNode.appendChild(childrenNode);
    // 注意：因为是使用的递归（深度遍历优先）所以parentId需要根据DOM结构去取出来！
    let parentId = childrenNode.previousSibling.getAttribute("data-id");
    for (let index = 0; index < data.children.length; index++) {
      this.renderNode_h(data.children[index], childrenNode, parentId);
    }

  } else {
    parentNode.appendChild(currentNode);
  }


  // 5.挂载到外部容器中
  wrap.appendChild(parentNode);
};

// 连接两个节点的方法（水平方向）
TreeMap.prototype.drawLineBetweenNode_h = function (parentNode, childNode) {
  // console.log('childNode',childNode)
  // 父节点的相对位置
  let parentNodeWidth = parentNode.offsetWidth;
  let parentNodeHeight = parentNode.offsetHeight;
  let parentNodeHeightHalf = parentNodeHeight / 2;
  let parentNodeLeft = parentNode.offsetLeft;
  let parentNodeTop = parentNode.offsetTop;

  // 父节点右侧的中心点
  let parentNodeRightCenter = {
    x: parentNodeLeft + parentNodeWidth,
    y: parentNodeTop + parentNodeHeightHalf,
  };
  let len = parentNode.getAttribute('len');
  // 子节点的相对位置
  let childNodeHeight = childNode.offsetHeight;
  let childNodeHeightHalf = childNodeHeight / 2;
  let childNodeLeft = childNode.offsetLeft - Number(len);
  let childNodeTop = childNode.offsetTop;

  // 子节点左侧的中心点
  let childNodeLeftCenter = {
    x: childNodeLeft,
    y: childNodeTop + childNodeHeightHalf,
  };

  // 父子节点中心点相对位置宽度一半
  let centerWidthHalf = Math.floor(Math.abs(childNodeLeftCenter.x - parentNodeRightCenter.x) / 2) + 2;


  // 父子节点中心点相对位置高度
  let centerHeight = Math.floor(Math.abs(childNodeLeftCenter.y - parentNodeRightCenter.y) + 10);

  // 父节点的右边横线
  let line1 = createEl("div", {
    width: centerWidthHalf + Number(len) + "px",
    height: this._lineWidth + "px",
    background: this._lineColor,
    position: "absolute",
    top: parentNodeHeightHalf + "px",
    right: -(centerWidthHalf + Number(len)) + "px",
  });

  // 子节点的左边横线
  let line2 = createEl("div", {
    width: centerWidthHalf + "px",
    height: this._lineWidth + "px",
    background: this._lineColor,
    position: "absolute",
    top: childNodeHeightHalf + "px",
    left: -(centerWidthHalf) + "px",
  });

  // 子节点的左边箭头
  let arrow = createEl("div", {
    content: "",
    position: "absolute",
    top: childNodeHeightHalf - this._arrowWidth + "px",
    left: -this._arrowWidth + "px",
    width: 0,
    height: 0,
    borderWidth: this._arrowWidth + "px",
    borderStyle: "solid",
    borderColor: "transparent",
    borderLeftColor: this._arrowColor,
    zIndex: 2,
  });

  // 两条横线的链接竖线
  let line3;
  if (parentNodeRightCenter.y > childNodeLeftCenter.y) {
    line3 = createEl("div", {
      width: this._lineWidth + "px",
      height: centerHeight + "px",
      background: this._lineColor,
      position: "absolute",
      top: 0,
      left: 0,
    });
    line2.appendChild(line3);
  } else if (parentNodeRightCenter.y < childNodeLeftCenter.y) {
    line3 = createEl("div", {
      width: this._lineWidth + "px",
      height: centerHeight + "px",
      background: this._lineColor,
      position: "absolute",
      bottom: 0,
      left: 0,
    });
    line2.appendChild(line3);
  } else {
    line3 = createEl("div", {
      width: this._lineWidth + "px",
      height: this._lineWidth + "px",
      background: this._lineColor,
      position: "absolute",
      top: 0,
      right: 0,
    });
    line1.appendChild(line3);
  }

  // 挂载到各自的节点上
  childNode.appendChild(arrow);
  parentNode.appendChild(line1);
  childNode.appendChild(line2);
};

// 递归创建节点（垂直方向）
TreeMap.prototype.renderNode_v = function (data, wrap, id) {
  // 1.创建父元素节点
  let parentNode = createEl("div", { display: "flex", flexDirection: "column", alignItems: "center", userSelect: "none" });


  // 2.创建当前元素节点
  let currentNode = this.createNode(data);
  currentNode.setAttribute("data-id", ++this._nodeNum);
  currentNode.setAttribute("data-fid", id ? id : 0);
  currentNode.setAttribute("data-item", JSON.stringify(data.data));
  currentNode.classList.add(this._nodeClass);

  // 3.是否给当前元素节点创建伸缩符
  if (!!data.shrink && !!data.children && data.children.length > 0) {
    let shrink = createEl("div", {
      width: "18px",
      height: "18px",
      textAlign: "center",
      lineHeight: "18px",
      position: "absolute",
      left: "50%",
      bottom: "-20px",
      cursor: "pointer",
      zIndex: "1",
      fontSize: "12px",
      border: "1px solid #cccccc",
      borderRadius: "50%",
      background: "#ffffff",
      transform: "translateX(-50%)",
    }, 'tree-map-shrink');
    if (!!data.hidden) {
      shrink.textContent = "+";
    } else {
      shrink.textContent = "-";
    }
    let that = this;
    shrink.addEventListener("click", function (data) {
      return function (e) {
        e.stopPropagation();
        data.hidden = !!!data.hidden;
        that.redraw();
      };
    }(data));
    currentNode.appendChild(shrink);
  }

  // 4.创建子元素节点
  if (!!data.children && data.children.length > 0 && !data.hidden) {
    let childrenNode = createEl("div", { display: "flex", flexDirection: "row", justifyContent: "center", userSelect: "none" });
    parentNode.appendChild(currentNode);
    parentNode.appendChild(childrenNode);
    // 注意：因为是使用的递归（深度遍历优先）所以parentId需要根据DOM结构去取出来！
    let parentId = childrenNode.previousSibling.getAttribute("data-id");
    for (let index = 0; index < data.children.length; index++) {
      this.renderNode_v(data.children[index], childrenNode, parentId);
    }

  } else {
    parentNode.appendChild(currentNode);
  }


  // 5.挂载到外部容器中
  wrap.appendChild(parentNode);
};

// 连接两个节点的方法（垂直方向）
TreeMap.prototype.drawLineBetweenNode_v = function (parentNode, childNode) {
  // 父节点的相对位置
  let parentNodeWidth = parentNode.offsetWidth;
  let parentNodeWidthHalf = parentNodeWidth / 2;
  let parentNodeHeight = parentNode.offsetHeight;
  let parentNodeLeft = parentNode.offsetLeft;
  let parentNodeTop = parentNode.offsetTop;

  // 父节点底部的中心点
  let parentNodeBottomCenter = {
    x: parentNodeLeft + parentNodeWidthHalf,
    y: parentNodeTop + parentNodeHeight,
  };

  // 子节点的相对位置
  let childNodeWidth = childNode.offsetWidth;
  let childNodeWidthHalf = childNodeWidth / 2;
  let childNodeLeft = childNode.offsetLeft;
  let childNodeTop = childNode.offsetTop;

  // 子节点顶部的中心点
  let childNodeTopCenter = {
    x: childNodeLeft + childNodeWidthHalf,
    y: childNodeTop,
  };

  // 父子节点中心点相对位置宽度
  let centerWidth = Math.floor(Math.abs(parentNodeBottomCenter.x - childNodeTopCenter.x) + 10);


  // 父子节点中心点相对位置高度一半
  let centerHeightHalf = Math.floor(Math.abs(childNodeTopCenter.y - parentNodeBottomCenter.y) / 2) + 1;

  // 父节点的底部竖线
  let line1 = createEl("div", {
    width: this._lineWidth + "px",
    height: centerHeightHalf + "px",
    background: this._lineColor,
    position: "absolute",
    bottom: -(centerHeightHalf) + "px",
    left: parentNodeWidthHalf + "px",
  });

  // 子节点的顶部竖线
  let line2 = createEl("div", {
    width: this._lineWidth + "px",
    height: centerHeightHalf + "px",
    background: this._lineColor,
    position: "absolute",
    top: -(centerHeightHalf) + "px",
    left: childNodeWidthHalf + "px",
  });

  // 子节点的顶部箭头
  let arrow = createEl("div", {
    content: "",
    position: "absolute",
    top: -this._arrowWidth + "px",
    left: childNodeWidthHalf - this._arrowWidth + "px",
    width: 0,
    height: 0,
    borderWidth: this._arrowWidth + "px",
    borderStyle: "solid",
    borderColor: "transparent",
    borderTopColor: this._arrowColor,
    zIndex: 2,
  });

  // 两条竖线的链接横线
  let line3;
  if (parentNodeBottomCenter.x > childNodeTopCenter.x) {
    line3 = createEl("div", {
      width: centerWidth + "px",
      height: this._lineWidth + "px",
      background: this._lineColor,
      position: "absolute",
      top: 0,
      left: 0,
    });
    line2.appendChild(line3);
  } else if (parentNodeBottomCenter.x < childNodeTopCenter.x) {
    line3 = createEl("div", {
      width: centerWidth + "px",
      height: this._lineWidth + "px",
      background: this._lineColor,
      position: "absolute",
      top: 0,
      right: 0,
    });
    line2.appendChild(line3);
  } else {
    line3 = createEl("div", {
      width: this._lineWidth + "px",
      height: this._lineWidth + "px",
      background: this._lineColor,
      position: "absolute",
      top: 0,
      left: 0,
    });
    line2.appendChild(line3);
  }

  // 挂载到各自的节点上
  childNode.appendChild(arrow);
  parentNode.appendChild(line1);
  childNode.appendChild(line2);
};

// 绘制节点之间的连线
TreeMap.prototype.drawline = function () {
  let selector = this._option.el + " ." + this._nodeClass;
  let treeNodes = document.querySelectorAll(selector);
  let that = this;
  treeNodes.forEach(function (currentNode) {
    let parentNode = document.querySelector(that._option.el + " ." + that._nodeClass + "[data-id='" + currentNode.getAttribute("data-fid") + "']");
    if (parentNode) {
      // 判断树状图轴方向 做对应的连线
      if (that._direction === "horizontal") {
        that.drawLineBetweenNode_h(parentNode, currentNode);
      } else {
        that.drawLineBetweenNode_v(parentNode, currentNode);
      }
    };
  });
};

// 重绘
TreeMap.prototype.redraw = function () {
  this._el.removeChild(this._el.children[0]);
  this._nodeNum = 0;
  this.init();
};

// 展开
TreeMap.prototype.expand = function () {
  if (!!this._data.shrink) this._data.hidden = false;
  if (this._data.children && this._data.children.length > 0) {
    for (let index = 0; index < this._data.children.length; index++) {
      const item = this._data.children[index];
      if (!!item.shrink) item.hidden = false;
    }
  };
  this.redraw();
};

// 收缩
TreeMap.prototype.collapse = function () {
  if (!!this._data.shrink) this._data.hidden = true;
  if (this._data.children && this._data.children.length > 0) {
    for (let index = 0; index < this._data.children.length; index++) {
      const item = this._data.children[index];
      if (!!item.shrink) item.hidden = true;
    }
  };
  this.redraw();
};

export default TreeMap;