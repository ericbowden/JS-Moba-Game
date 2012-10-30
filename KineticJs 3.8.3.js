/**
 * KineticJS JavaScript Library v3.8.3
 * http://www.kineticjs.com/
 * Copyright 2012, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: Mar 11 2012
 *
 * Copyright (C) 2011 - 2012 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Kinetic={};Kinetic.GlobalObject={stages:[],idCounter:0,isAnimating:!1,frame:{time:0,timeDiff:0,lastTime:0},drag:{moving:!1,node:undefined,offset:{x:0,y:0}},extend:function(a,b){for(var c in b.prototype)b.prototype.hasOwnProperty(c)&&a.prototype[c]===undefined&&(a.prototype[c]=b.prototype[c])},_isaCanvasAnimating:function(){for(var a=0;a<this.stages.length;a++)if(this.stages[a].isAnimating)return!0;return!1},_runFrames:function(){for(var a=0;a<this.stages.length;a++)this.stages[a].isAnimating&&this.stages[a].onFrameFunc(this.frame)},_updateFrameObject:function(){var a=new Date,b=a.getTime();this.frame.lastTime===0?this.frame.lastTime=b:(this.frame.timeDiff=b-this.frame.lastTime,this.frame.lastTime=b,this.frame.time+=this.frame.timeDiff)},_animationLoop:function(){if(this.isAnimating){this._updateFrameObject(),this._runFrames();var a=this;requestAnimFrame(function(){a._animationLoop()})}},_handleAnimation:function(){var a=this;!this.isAnimating&&this._isaCanvasAnimating()?(this.isAnimating=!0,a._animationLoop()):this.isAnimating&&!this._isaCanvasAnimating()&&(this.isAnimating=!1,this.frame.lastTime=0)}},window.requestAnimFrame=function(a){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1e3/60)}}(),Kinetic.Node=function(a){this.visible=!0,this.isListening=!0,this.name=undefined,this.alpha=1,this.x=0,this.y=0,this.scale={x:1,y:1},this.rotation=0,this.centerOffset={x:0,y:0},this.eventListeners={},this.drag={x:!1,y:!1};if(a)for(var b in a)switch(b){case"draggable":this.draggable(a[b]);break;case"draggableX":this.draggableX(a[b]);break;case"draggableY":this.draggableY(a[b]);break;case"listen":this.listen(a[b]);break;case"rotationDeg":this.rotation=a[b]*Math.PI/180;break;default:this[b]=a[b]}this.centerOffset.x===undefined&&(this.centerOffset.x=0),this.centerOffset.y===undefined&&(this.centerOffset.y=0)},Kinetic.Node.prototype={on:function(a,b){var c=a.split(" ");for(var d=0;d<c.length;d++){var e=c[d],f=e.indexOf("touch")===-1?"on"+e:e,g=f.split("."),h=g[0],i=g.length>1?g[1]:"";this.eventListeners[h]||(this.eventListeners[h]=[]),this.eventListeners[h].push({name:i,handler:b})}},off:function(a){var b=a.split(" ");for(var c=0;c<b.length;c++){var d=b[c],e=d.indexOf("touch")===-1?"on"+d:d,f=e.split("."),g=f[0];if(this.eventListeners[g]&&f.length>1){var h=f[1];for(var i=0;i<this.eventListeners[g].length;i++)if(this.eventListeners[g][i].name===h){this.eventListeners[g].splice(i,1),this.eventListeners[g].length===0&&(this.eventListeners[g]=undefined);break}}else this.eventListeners[g]=undefined}},show:function(){this.visible=!0},hide:function(){this.visible=!1},getZIndex:function(){return this.index},setScale:function(a,b){b?(this.scale.x=a,this.scale.y=b):(this.scale.x=a,this.scale.y=a)},getScale:function(){return this.scale},setPosition:function(a,b){this.x=a,this.y=b},getPosition:function(){return{x:this.x,y:this.y}},getAbsolutePosition:function(){var a=this.x,b=this.y,c=this.getParent();while(c.className!=="Stage")a+=c.x,b+=c.y,c=c.parent;return{x:a,y:b}},move:function(a,b){this.x+=a,this.y+=b},setRotation:function(a){this.rotation=a},setRotationDeg:function(a){this.rotation=a*Math.PI/180},getRotation:function(){return this.rotation},getRotationDeg:function(){return this.rotation*180/Math.PI},rotate:function(a){this.rotation+=a},rotateDeg:function(a){this.rotation+=a*Math.PI/180},listen:function(a){this.isListening=a},moveToTop:function(){var a=this.index;this.parent.children.splice(a,1),this.parent.children.push(this),this.parent._setChildrenIndices()},moveUp:function(){var a=this.index;this.parent.children.splice(a,1),this.parent.children.splice(a+1,0,this),this.parent._setChildrenIndices()},moveDown:function(){var a=this.index;a>0&&(this.parent.children.splice(a,1),this.parent.children.splice(a-1,0,this),this.parent._setChildrenIndices())},moveToBottom:function(){var a=this.index;this.parent.children.splice(a,1),this.parent.children.unshift(this),this.parent._setChildrenIndices()},setZIndex:function(a){var b=this.index;this.parent.children.splice(b,1),this.parent.children.splice(a,0,this),this.parent._setChildrenIndices()},setAlpha:function(a){this.alpha=a},getAlpha:function(){return this.alpha},getAbsoluteAlpha:function(){var a=1,b=this;while(b.className!=="Stage")a*=b.alpha,b=b.parent;return a},draggable:function(a){if(a){var b=!this.drag.x&&!this.drag.y;this.drag.x=!0,this.drag.y=!0,b&&this._initDrag()}else this.drag.x=!1,this.drag.y=!1,this._dragCleanup()},draggableX:function(a){if(a){var b=!this.drag.x&&!this.drag.y;this.drag.x=!0,b&&this._initDrag()}else this.drag.x=!1,this._dragCleanup()},draggableY:function(a){if(a){var b=!this.drag.x&&!this.drag.y;this.drag.y=!0,b&&this._initDrag()}else this.drag.y=!1,this._dragCleanup()},isDragging:function(){var a=Kinetic.GlobalObject;return a.drag.node!==undefined&&a.drag.node.id===this.id&&a.drag.moving},moveTo:function(a){var b=this.parent;b.children.splice(this.index,1),b._setChildrenIndices(),a.children.push(this),this.index=a.children.length-1,this.parent=a,a._setChildrenIndices(),this.name&&(b.childrenNames[this.name]=undefined,a.childrenNames[this.name]=this)},getParent:function(){return this.parent},getLayer:function(){return this.className==="Layer"?this:this.getParent().getLayer()},getStage:function(){return this.getParent().getStage()},getName:function(){return this.name},setCenterOffset:function(a,b){this.centerOffset.x=a,this.centerOffset.y=b},getCenterOffset:function(){return this.centerOffset},_initDrag:function(){var a=Kinetic.GlobalObject,b=this;this.on("mousedown.initdrag touchstart.initdrag",function(c){var d=b.getStage(),e=d.getUserPosition();e&&(a.drag.node=b,a.drag.offset.x=e.x-b.x,a.drag.offset.y=e.y-b.y)})},_dragCleanup:function(){!this.drag.x&&!this.drag.y&&(this.off("mousedown.initdrag"),this.off("touchstart.initdrag"))},_handleEvents:function(a,b){function c(d){var e=d.eventListeners;if(e[a]){var f=e[a];for(var g=0;g<f.length;g++)f[g].handler.apply(d,[b])}d.parent.className!=="Stage"&&c(d.parent)}c(this)}},Kinetic.Container=function(){this.children=[],this.childrenNames={}},Kinetic.Container.prototype={getChildren:function(){return this.children},getChild:function(a){return this.childrenNames[a]},removeChildren:function(){while(this.children.length>0)this.remove(this.children[0])},_remove:function(a){a.name!==undefined&&(this.childrenNames[a.name]=undefined),this.children.splice(a.index,1),this._setChildrenIndices(),a=undefined},_drawChildren:function(){var a=this.children;for(var b=0;b<a.length;b++){var c=a[b];c.className==="Shape"?c._draw(c.getLayer()):c._draw()}},_add:function(a){a.name&&(this.childrenNames[a.name]=a),a.id=Kinetic.GlobalObject.idCounter++,a.index=this.children.length,a.parent=this,this.children.push(a)},_setChildrenIndices:function(){if(this.className==="Stage"){var a=this.container.children,b=a[0],c=a[1];this.container.innerHTML="",this.container.appendChild(b),this.container.appendChild(c)}for(var d=0;d<this.children.length;d++)this.children[d].index=d,this.className==="Stage"&&this.container.appendChild(this.children[d].canvas)}},Kinetic.Stage=function(a,b,c){this.className="Stage",this.container=typeof a=="string"?document.getElementById(a):a,this.width=b,this.height=c,this.scale={x:1,y:1},this.dblClickWindow=400,this.targetShape=undefined,this.clickStart=!1,this.targetFound=!1,this.mousePos=undefined,this.mouseDown=!1,this.mouseUp=!1,this.touchPos=undefined,this.touchStart=!1,this.touchEnd=!1,this.bufferLayer=new Kinetic.Layer,this.backstageLayer=new Kinetic.Layer,this.bufferLayer.parent=this,this.backstageLayer.parent=this;var d=this.backstageLayer;this._stripLayer(d),this.bufferLayer.getCanvas().style.display="none",this.backstageLayer.getCanvas().style.display="none",this.bufferLayer.canvas.width=this.width,this.bufferLayer.canvas.height=this.height,this.container.appendChild(this.bufferLayer.canvas),this.backstageLayer.canvas.width=this.width,this.backstageLayer.canvas.height=this.height,this.container.appendChild(this.backstageLayer.canvas),this._listen(),this._prepareDrag();var e=Kinetic.GlobalObject.stages;e.push(this),this.id=Kinetic.GlobalObject.idCounter++,this.isAnimating=!1,this.onFrameFunc=undefined,Kinetic.Container.apply(this,[])},Kinetic.Stage.prototype={onFrame:function(a){this.onFrameFunc=a},start:function(){this.isAnimating=!0,Kinetic.GlobalObject._handleAnimation()},stop:function(){this.isAnimating=!1,Kinetic.GlobalObject._handleAnimation()},draw:function(){this._drawChildren()},setSize:function(a,b){var c=this.children;for(var d=0;d<c.length;d++){var e=c[d];e.getCanvas().width=a,e.getCanvas().height=b,e.draw()}this.width=a,this.height=b,this.bufferLayer.getCanvas().width=a,this.bufferLayer.getCanvas().height=b,this.backstageLayer.getCanvas().width=a,this.backstageLayer.getCanvas().height=b},setScale:function(a,b){function g(a){for(var b=0;b<a.length;b++){var e=a[b];e.x*=f.scale.x/c,e.y*=f.scale.y/d,e.children&&g(e.children)}}var c=this.scale.x,d=this.scale.y;b?(this.scale.x=a,this.scale.y=b):(this.scale.x=a,this.scale.y=a);var e=this.children,f=this;g(e)},getScale:function(){return this.scale},clear:function(){var a=this.children;for(var b=0;b<a.length;b++)a[b].clear()},toDataURL:function(a){function e(f){var g=d[f].getCanvas().toDataURL(),h=new Image;h.onload=function(){c.drawImage(this,0,0),f++,f<d.length?e(f):a(b.getCanvas().toDataURL())},h.src=g}var b=this.bufferLayer,c=b.getContext(),d=this.children;b.clear(),e(0)},remove:function(a){this.container.removeChild(a.canvas),this._remove(a)},on:function(a,b){var c=a.split(" ");for(var d=0;d<c.length;d++){var e=c[d];this.container.addEventListener(e,b,!1)}},add:function(a){a.name&&(this.childrenNames[a.name]=a),a.canvas.width=this.width,a.canvas.height=this.height,this._add(a),a.draw(),this.container.appendChild(a.canvas)},getMousePosition:function(a){return this.mousePos},getTouchPosition:function(a){return this.touchPos},getUserPosition:function(a){return this.getTouchPosition()||this.getMousePosition()},getContainer:function(){return this.container},getStage:function(){return this},_detectEvent:function(a,b){var c=Kinetic.GlobalObject.drag.moving,d=this.backstageLayer,e=d.getContext(),f=Kinetic.GlobalObject,g=this.getUserPosition(),h=a.eventListeners;a._draw(d),this.targetShape&&a.id===this.targetShape.id&&(this.targetFound=!0);if(a.visible&&g!==undefined&&e.isPointInPath(g.x,g.y)){if(!c&&this.mouseDown)return this.mouseDown=!1,this.clickStart=!0,a._handleEvents("onmousedown",b),!0;if(this.mouseUp)return this.mouseUp=!1,a._handleEvents("onmouseup",b),this.clickStart&&(!f.drag.moving||!f.drag.node)&&(a._handleEvents("onclick",b),a.inDoubleClickWindow&&a._handleEvents("ondblclick",b),a.inDoubleClickWindow=!0,setTimeout(function(){a.inDoubleClickWindow=!1},this.dblClickWindow)),!0;if(this.touchStart){this.touchStart=!1,a._handleEvents("touchstart",b);if(h.ondbltap&&a.inDoubleClickWindow){var i=h.ondbltap;for(var j=0;j<i.length;j++)i[j].handler.apply(a,[b])}return a.inDoubleClickWindow=!0,setTimeout(function(){a.inDoubleClickWindow=!1},this.dblClickWindow),!0}if(this.touchEnd)return this.touchEnd=!1,a._handleEvents("touchend",b),!0;if(!c&&h.touchmove)return a._handleEvents("touchmove",b),!0;if(!c&&(!this.targetShape||!this.targetFound&&a.id!==this.targetShape.id)){if(this.targetShape){var k=this.targetShape.eventListeners;k&&this.targetShape._handleEvents("onmouseout",b)}return this.targetShape=a,this.targetFound=!0,a._handleEvents("onmouseover",b),!0}if(!c)return a._handleEvents("onmousemove",b),!0}else if(!c&&this.targetShape&&this.targetShape.id===a.id)return this.targetShape=undefined,a._handleEvents("onmouseout",b),!0;return!1},_traverseChildren:function(a,b){var c=a.children;for(var d=c.length-1;d>=0;d--){var e=c[d];if(e.className==="Shape"){var f=this._detectEvent(e,b);if(f)return!0}else this._traverseChildren(e)}return!1},_handleEvent:function(a){var b=Kinetic.GlobalObject;a||(a=window.event),this._setMousePosition(a),this._setTouchPosition(a);var c=this.backstageLayer;c.clear(),this.targetFound=!1;for(var d=this.children.length-1;d>=0;d--){var e=this.children[d];e.visible&&d>=0&&e.isListening&&this._traverseChildren(e,a)&&(d=-1)}},_listen:function(){var a=this;this.container.addEventListener("mousedown",function(b){a.mouseDown=!0,a._handleEvent(b)},!1),this.container.addEventListener("mousemove",function(b){a.mouseUp=!1,a.mouseDown=!1,a._handleEvent(b)},!1),this.container.addEventListener("mouseup",function(b){a.mouseUp=!0,a.mouseDown=!1,a._handleEvent(b),a.clickStart=!1},!1),this.container.addEventListener("mouseover",function(b){a._handleEvent(b)},!1),this.container.addEventListener("mouseout",function(b){a.mousePos=undefined},!1),this.container.addEventListener("touchstart",function(b){b.preventDefault(),a.touchStart=!0,a._handleEvent(b)},!1),this.container.addEventListener("touchmove",function(b){b.preventDefault(),a._handleEvent(b)},!1),this.container.addEventListener("touchend",function(b){b.preventDefault(),a.touchEnd=!0,a._handleEvent(b)},!1)},_setMousePosition:function(a){var b=a.clientX-this._getContainerPosition().left+window.pageXOffset,c=a.clientY-this._getContainerPosition().top+window.pageYOffset;this.mousePos={x:b,y:c}},_setTouchPosition:function(a){if(a.touches!==undefined&&a.touches.length===1){var b=a.touches[0],c=b.clientX-this._getContainerPosition().left+window.pageXOffset,d=b.clientY-this._getContainerPosition().top+window.pageYOffset;this.touchPos={x:c,y:d}}},_getContainerPosition:function(){var a=this.container,b=0,c=0;while(a&&a.tagName!=="BODY")b+=a.offsetTop,c+=a.offsetLeft,a=a.offsetParent;return{top:b,left:c}},_stripLayer:function(a){a.context.stroke=function(){},a.context.fill=function(){},a.context.fillRect=function(b,c,d,e){a.context.rect(b,c,d,e)},a.context.strokeRect=function(b,c,d,e){a.context.rect(b,c,d,e)},a.context.drawImage=function(){},a.context.fillText=function(){},a.context.strokeText=function(){}},_endDrag:function(a){var b=Kinetic.GlobalObject;b.drag.node&&b.drag.moving&&(b.drag.moving=!1,b.drag.node._handleEvents("ondragend",a)),b.drag.node=undefined},_prepareDrag:function(){var a=this;this.on("mousemove touchmove",function(b){var c=Kinetic.GlobalObject;if(c.drag.node){var d=a.getUserPosition();c.drag.node.drag.x&&(c.drag.node.x=d.x-c.drag.offset.x),c.drag.node.drag.y&&(c.drag.node.y=d.y-c.drag.offset.y),c.drag.node.getLayer().draw(),c.drag.moving||(c.drag.moving=!0,c.drag.node._handleEvents("ondragstart",b)),c.drag.node._handleEvents("ondragmove",b)}},!1),this.on("mouseup touchend mouseout",function(b){a._endDrag(b)})}},Kinetic.GlobalObject.extend(Kinetic.Stage,Kinetic.Container),Kinetic.Layer=function(a){this.className="Layer",this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.canvas.style.position="absolute",Kinetic.Container.apply(this,[]),Kinetic.Node.apply(this,[a])},Kinetic.Layer.prototype={draw:function(){this._draw()},clear:function(){var a=this.getContext(),b=this.getCanvas();a.clearRect(0,0,b.width,b.height)},getCanvas:function(){return this.canvas},getContext:function(){return this.context},add:function(a){this._add(a)},remove:function(a){this._remove(a)},_draw:function(){this.clear(),this.visible&&this._drawChildren()}},Kinetic.GlobalObject.extend(Kinetic.Layer,Kinetic.Container),Kinetic.GlobalObject.extend(Kinetic.Layer,Kinetic.Node),Kinetic.Group=function(a){this.className="Group",Kinetic.Container.apply(this,[]),Kinetic.Node.apply(this,[a])},Kinetic.Group.prototype={add:function(a){this._add(a)},remove:function(a){this._remove(a)},_draw:function(){this.visible&&this._drawChildren()}},Kinetic.GlobalObject.extend(Kinetic.Group,Kinetic.Container),Kinetic.GlobalObject.extend(Kinetic.Group,Kinetic.Node),Kinetic.Shape=function(a){this.className="Shape";if(a.stroke!==undefined||a.strokeWidth!==undefined)a.stroke===undefined?a.stroke="black":a.strokeWidth===undefined&&(a.strokeWidth=2);this.drawFunc=a.drawFunc,Kinetic.Node.apply(this,[a])},Kinetic.Shape.prototype={getContext:function(){return this.tempLayer.getContext()},getCanvas:function(){return this.tempLayer.getCanvas()},fillStroke:function(){var a=this.getContext();this.fill!==undefined&&(a.fillStyle=this.fill,a.fill()),this.stroke!==undefined&&(a.lineWidth=this.strokeWidth===undefined?1:this.strokeWidth,a.strokeStyle=this.stroke,a.stroke())},setFill:function(a){this.fill=a},getFill:function(){return this.fill},setStroke:function(a){this.stroke=a},getStroke:function(){return this.stroke},setStrokeWidth:function(a){this.strokeWidth=a},getStrokeWidth:function(){return this.strokeWidth},_draw:function(a){if(this.visible){var b=a.getStage(),c=a.getContext(),d=[];d.unshift(this);var e=this.parent;while(e.className!=="Stage")d.unshift(e),e=e.parent;for(var f=0;f<d.length;f++){var g=d[f];c.save(),(g.x!==0||g.y!==0)&&c.translate(g.x,g.y),(g.centerOffset.x!==0||g.centerOffset.y!==0)&&c.translate(g.centerOffset.x,g.centerOffset.y),g.rotation!==0&&c.rotate(g.rotation),(g.scale.x!==1||g.scale.y!==1)&&c.scale(g.scale.x,g.scale.y),(g.centerOffset.x!==0||g.centerOffset.y!==0)&&c.translate(-1*g.centerOffset.x,-1*g.centerOffset.y),g.getAbsoluteAlpha()!==1&&(c.globalAlpha=g.getAbsoluteAlpha())}c.save(),b&&(b.scale.x!==1||b.scale.y!==1)&&c.scale(b.scale.x,b.scale.y),this.tempLayer=a,this.drawFunc.call(this);for(var h=0;h<d.length;h++)c.restore();c.restore()}}},Kinetic.GlobalObject.extend(Kinetic.Shape,Kinetic.Node),Kinetic.Rect=function(a){a.drawFunc=function(){var a=this.getCanvas(),b=this.getContext();b.beginPath(),b.rect(0,0,this.width,this.height),b.closePath(),this.fillStroke()},Kinetic.Shape.apply(this,[a])},Kinetic.Rect.prototype={setWidth:function(a){this.width=a},getWidth:function(){return this.width},setHeight:function(a){this.height=a},getHeight:function(){return this.height},setSize:function(a,b){this.width=a,this.height=b}},Kinetic.GlobalObject.extend(Kinetic.Rect,Kinetic.Shape),Kinetic.Circle=function(a){a.drawFunc=function(){var a=this.getCanvas(),b=this.getContext();b.beginPath(),b.arc(0,0,this.radius,0,Math.PI*2,!0),b.closePath(),this.fillStroke()},Kinetic.Shape.apply(this,[a])},Kinetic.Circle.prototype={setRadius:function(a){this.radius=a},getRadius:function(){return this.radius}},Kinetic.GlobalObject.extend(Kinetic.Circle,Kinetic.Shape),Kinetic.Image=function(a){a.width===undefined&&(a.width=a.image.width),a.height===undefined&&(a.height=a.image.height),a.drawFunc=function(){var a=this.getCanvas(),b=this.getContext();b.beginPath(),b.rect(0,0,this.width,this.height),b.closePath(),this.fillStroke(),b.drawImage(this.image,0,0,this.width,this.height)},Kinetic.Shape.apply(this,[a])},Kinetic.Image.prototype={setImage:function(a){this.image=a},getImage:function(a){return this.image},setWidth:function(a){this.width=a},getWidth:function(){return this.width},setHeight:function(a){this.height=a},getHeight:function(){return this.height},setSize:function(a,b){this.width=a,this.height=b}},Kinetic.GlobalObject.extend(Kinetic.Image,Kinetic.Shape),Kinetic.Polygon=function(a){a.drawFunc=function(){var a=this.getContext();a.beginPath(),a.moveTo(this.points[0].x,this.points[0].y);for(var b=1;b<this.points.length;b++)a.lineTo(this.points[b].x,this.points[b].y);a.closePath(),this.fillStroke()},Kinetic.Shape.apply(this,[a])},Kinetic.Polygon.prototype={setPoints:function(a){this.points=a},getPoints:function(){return this.points}},Kinetic.GlobalObject.extend(Kinetic.Polygon,Kinetic.Shape),Kinetic.RegularPolygon=function(a){a.drawFunc=function(){var a=this.getContext();a.beginPath(),a.moveTo(0,0-this.radius);for(var b=1;b<this.sides;b++){var c=this.radius*Math.sin(b*2*Math.PI/this.sides),d=-1*this.radius*Math.cos(b*2*Math.PI/this.sides);a.lineTo(c,d)}a.closePath(),this.fillStroke()},Kinetic.Shape.apply(this,[a])},Kinetic.RegularPolygon.prototype={setPoints:function(a){this.points=a},getPoints:function(){return this.points},setRadius:function(a){this.radius=a},getRadius:function(){return this.radius},setSides:function(a){this.sides=a},getSides:function(){return this.sides}},Kinetic.GlobalObject.extend(Kinetic.RegularPolygon,Kinetic.Shape),Kinetic.Star=function(a){a.drawFunc=function(){var a=this.getContext();a.beginPath(),a.moveTo(0,0-this.outerRadius);for(var b=1;b<this.points*2;b++){var c=b%2===0?this.outerRadius:this.innerRadius,d=c*Math.sin(b*Math.PI/this.points),e=-1*c*Math.cos(b*Math.PI/this.points);a.lineTo(d,e)}a.closePath(),this.fillStroke()},Kinetic.Shape.apply(this,[a])},Kinetic.Star.prototype={setPoints:function(a){this.points=a},getPoints:function(){return this.points},setOuterRadius:function(a){this.outerRadius=a},getOuterRadius:function(){return this.outerRadius},setInnerRadius:function(a){this.innerRadius=a},getInnerRadius:function(){return this.innerRadius}},Kinetic.GlobalObject.extend(Kinetic.Star,Kinetic.Shape),Kinetic.Text=function(a){if(a.textStroke!==undefined||a.textStrokeWidth!==undefined)a.textStroke===undefined?a.textStroke="black":a.textStrokeWidth===undefined&&(a.textStrokeWidth=2);a.align===undefined&&(a.align="left"),a.verticalAlign===undefined&&(a.verticalAlign="top"),a.padding===undefined&&(a.padding=0),a.drawFunc=function(){var a=this.getCanvas(),b=this.getContext();b.font=this.fontSize+"pt "+this.fontFamily,b.textBaseline="middle";var c=b.measureText(this.text),d=this.fontSize,e=c.width,f=this.padding,g=0,h=0;switch(this.align){case"center":g=e/-2-f;break;case"right":g=-1*e-f}switch(this.verticalAlign){case"middle":h=d/-2-f;break;case"bottom":h=-1*d-f}b.save(),b.beginPath(),b.rect(g,h,e+f*2,d+f*2),b.closePath(),this.fillStroke(),b.restore();var i=f+g,j=d/2+f+h;this.textFill!==undefined&&(b.fillStyle=this.textFill,b.fillText(this.text,i,j));if(this.textStroke!==undefined||this.textStrokeWidth!==undefined)this.textStroke===undefined?this.textStroke="black":this.textStrokeWidth===undefined&&(this.textStrokeWidth=2),b.lineWidth=this.textStrokeWidth,b.strokeStyle=this.textStroke,b.strokeText(this.text,i,j)},Kinetic.Shape.apply(this,[a])},Kinetic.Text.prototype={setFontFamily:function(a){this.fontFamily=a},getFontFamily:function(){return this.fontFamily},setFontSize:function(a){this.fontSize=a},getFontSize:function(){return this.fontSize},setTextFill:function(a){this.textFill=a},getTextFill:function(){return this.textFill},setTextStroke:function(a){this.textStroke=a},getTextStroke:function(){return this.textStroke},setTextStrokeWidth:function(a){this.textStrokeWidth=a},getTextStrokeWidth:function(){return this.textStrokeWidth},setPadding:function(a){this.padding=a},getPadding:function(){return this.padding},setAlign:function(a){this.align=a},getAlign:function(){return this.align},setVerticalAlign:function(a){this.verticalAlign=a},getVerticalAlign:function(){return this.verticalAlign},setText:function(a){this.text=a},getText:function(){return this.text}},Kinetic.GlobalObject.extend(Kinetic.Text,Kinetic.Shape);