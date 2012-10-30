/**
 * KineticJS JavaScript Library v3.7.1
 * http://www.kineticjs.com/
 * Copyright 2012, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: Feb 5 2012
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
///////////////////////////////////////////////////////////////////////
//  Global Object
///////////////////////////////////////////////////////////////////////
var Kinetic = {};
Kinetic.GlobalObject = {
    stages: [],
    idCounter: 0,
    extend: function(obj1, obj2){
        for (var key in obj2.prototype) {
            obj1.prototype[key] = obj2.prototype[key];
        }
    }
};

///////////////////////////////////////////////////////////////////////
//  Node
///////////////////////////////////////////////////////////////////////
/**
 * Node constructor.  Node is a base class for the
 * Layer, Group, and Shape classes
 * @param {Object} name
 */
Kinetic.Node = function(name){
    this.visible = true;
    this.isListening = true;
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.scale = {
        x: 1,
        y: 1
    };
    this.rotation = 0;
    this.eventListeners = {};
    this.drag = {
        x: false,
        y: false
    };
};

Kinetic.Node.prototype = {
    /**
     * bind event to node
     * @param {String} typesStr
     * @param {function} handler
     */
    on: function(typesStr, handler){
        var types = typesStr.split(" ");
        /*
         * loop through types and attach event listeners to
         * each one.  eg. "click mouseover.namespace mouseout"
         * will create three event bindings
         */
        for (var n = 0; n < types.length; n++) {
            var type = types[n];
            var event = (type.indexOf('touch') == -1) ? 'on' + type : type;
            var parts = event.split(".");
            var baseEvent = parts[0];
            var name = parts.length > 1 ? parts[1] : "";
            
            if (!this.eventListeners[baseEvent]) {
                this.eventListeners[baseEvent] = [];
            }
            
            this.eventListeners[baseEvent].push({
                name: name,
                handler: handler
            });
        }
    },
    /**
     * unbind event to node
     * @param {String} typesStr
     */
    off: function(typesStr){
        var types = typesStr.split(" ");
        
        for (var n = 0; n < types.length; n++) {
            var type = types[n];
            var event = (type.indexOf('touch') == -1) ? 'on' + type : type;
            var parts = event.split(".");
            var baseEvent = parts[0];
            
            if (this.eventListeners[baseEvent] && parts.length > 1) {
                var name = parts[1];
                
                for (var i = 0; i < this.eventListeners[baseEvent].length; i++) {
                    if (this.eventListeners[baseEvent][i].name == name) {
                        this.eventListeners[baseEvent].splice(i, 1);
                        if (this.eventListeners[baseEvent].length === 0) {
                            this.eventListeners[baseEvent] = undefined;
                        }
                        break;
                    }
                }
            }
            else {
                this.eventListeners[baseEvent] = undefined;
            }
        }
    },
    /**
     * show node
     */
    show: function(){
        this.visible = true;
    },
    /**
     * hide node
     */
    hide: function(){
        this.visible = false;
    },
    /**
     * get zIndex
     */
    getZIndex: function(){
        return this.index;
    },
    /**
     * set node scale
     * @param {number} scaleX
     * @param {number} scaleY
     */
    setScale: function(scaleX, scaleY){
        if (scaleY) {
            this.scale.x = scaleX;
            this.scale.y = scaleY;
        }
        else {
            this.scale.x = scaleX;
            this.scale.y = scaleX;
        }
    },
    /**
     * set node position
     * @param {number} x
     * @param {number} y
     */
    setPosition: function(x, y){
        this.x = x;
        this.y = y;
    },
    /**
     * get node position
     */
    getPosition: function(){
        return {
            x: this.x,
            y: this.y
        };
    },
    /**
     * move node
     * @param {number} x
     * @param {number} y
     */
    move: function(x, y){
        this.x += x;
        this.y += y;
    },
    /**
     * set node rotation
     * @param {number} theta
     */
    setRotation: function(theta){
        this.rotation = theta;
    },
    /**
     * rotate node
     * @param {number} theta
     */
    rotate: function(theta){
        this.rotation += theta;
    },
    /**
     * listen or don't listen to events
     * @param {boolean} isListening
     */
    listen: function(isListening){
        this.isListening = isListening;
    },
    /**
     * move node to top
     */
    moveToTop: function(){
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.push(this);
        this.parent.setChildrenIndices();
    },
    /**
     * move node up
     */
    moveUp: function(){
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.splice(index + 1, 0, this);
        this.parent.setChildrenIndices();
    },
    /**
     * move node down
     */
    moveDown: function(){
        var index = this.index;
        if (index > 0) {
            this.parent.children.splice(index, 1);
            this.parent.children.splice(index - 1, 0, this);
            this.parent.setChildrenIndices();
        }
    },
    /**
     * move node to bottom
     */
    moveToBottom: function(){
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.unshift(this);
        this.parent.setChildrenIndices();
    },
    /**
     * set zIndex
     * @param {int} index
     */
    setZIndex: function(zIndex){
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.splice(zIndex, 0, this);
        this.parent.setChildrenIndices();
    },
    /**
     * initialize drag and drop
     */
    initDrag: function(){
        var that = this;
        var types = ["mousedown", "touchstart"];
        
        for (var n = 0; n < types.length; n++) {
            var pubType = types[n];
            (function(){
                var type = pubType;
                that.on(type + ".initdrag", function(evt){
                    var stage = that.layer.stage;
                    var pos = stage.getUserPosition();
                    
                    if (pos) {
                        stage.nodeDragging = that;
                        stage.nodeDragging.offset = {};
                        stage.nodeDragging.offset.x = pos.x - that.x;
                        stage.nodeDragging.offset.y = pos.y - that.y;
                        
                        // execute dragstart events if defined
                        that.handleEvents("ondragstart", evt);
                    }
                });
            })();
        }
    },
    /**
     * remove drag and drop event listener
     */
    dragCleanup: function(){
        if (!this.drag.x && !this.drag.y) {
            this.off("mousedown.initdrag");
            this.off("touchstart.initdrag");
        }
    },
    /**
     * enable/disable drag and drop for box x and y direction
     * @param {boolean} setDraggable
     */
    draggable: function(setDraggable){
        if (setDraggable) {
            var needInit = !this.drag.x && !this.drag.y;
            this.drag = {
                x: true,
                y: true
            };
            if (needInit) {
                this.initDrag();
            }
        }
        else {
            this.drag = {
                x: false,
                y: false
            };
            this.dragCleanup();
        }
    },
    /**
     * enable/disable drag and drop for x only
     * @param {boolean} setDraggable
     */
    draggableX: function(setDraggable){
        if (setDraggable) {
            var needInit = !this.drag.x && !this.drag.y;
            this.drag.x = true;
            if (needInit) {
                this.initDrag();
            }
        }
        else {
            this.drag.x = false;
            this.dragCleanup();
        }
    },
    /**
     * enable/disable drag and drop for y only
     * @param {boolean} setDraggable
     */
    draggableY: function(setDraggable){
        if (setDraggable) {
            var needInit = !this.drag.x && !this.drag.y;
            this.drag.y = true;
            if (needInit) {
                this.initDrag();
            }
        }
        else {
            this.drag.y = false;
            this.dragCleanup();
        }
    },
    /**
     * handle node events
     * @param {string} eventType
     * @param {Event} evt
     */
    handleEvents: function(eventType, evt){
        // generic events handler
        function handle(obj){
            var el = obj.eventListeners;
            if (el[eventType]) {
                var events = el[eventType];
                for (var i = 0; i < events.length; i++) {
                    events[i].handler.apply(obj, [evt]);
                }
            }
            
            if (obj.parent.className !== "Stage") {
                handle(obj.parent);
            }
        }
        /*
         * simulate bubbling by handling node events
         * first, followed by group events, followed
         * by layer events
         */
        handle(this);
    },
    /**
     * get node's layer
     */
    getLayer: function(){
        return this.layer;
    },
    /**
     * move node to another container
     * @param {Layer} newLayer
     */
    moveTo: function(newContainer){
        var parent = this.parent;
        // remove from parent's children
        parent.children.splice(this.index, 1);
        parent.setChildrenIndices();
        
        // add to new parent
        newContainer.children.push(this);
        this.index = newContainer.children.length - 1;
        this.parent = newContainer;
        this.layer = newContainer.layer;
        newContainer.setChildrenIndices();
        
        // update children hashes
        if (this.name) {
            parent.childrenNames[this.name] = undefined;
            newContainer.childrenNames[this.name] = this;
        }
    },
    /**
     * get parent
     */
    getParent: function(){
        return this.parent;
    },
    /**
     * get stage
     */
    getStage: function(){
        return this.stage;
    }
};

///////////////////////////////////////////////////////////////////////
//  Container
///////////////////////////////////////////////////////////////////////

/**
 * Container constructor.  Container is the base class for
 * Stage, Layer, and Group
 */
Kinetic.Container = function(){
    this.children = [];
    this.childrenNames = {};
};

// methods
Kinetic.Container.prototype = {
    /**
     * set children indices
     */
    setChildrenIndices: function(){
        for (var n = 0; n < this.children.length; n++) {
            this.children[n].index = n;
        }
    },
    /**
     * recursively traverse the container tree
     * and draw the children
     * @param {Object} obj
     */
    drawChildren: function(){
        var children = this.children;
        for (var n = 0; n < children.length; n++) {
            var child = children[n];
            if (child.className == "Shape") {
                child.draw(child.layer);
            }
            else {
                child.draw();
            }
        }
    },
    /**
     * get children
     */
    getChildren: function(){
        return this.children;
    },
    /**
     * get node by name
     * @param {string} name
     */
    getChild: function(name){
        return this.childrenNames[name];
    },
    /**
     * add node to container
     * @param {Node} child
     */
    _add: function(child){
        if (child.name) {
            this.childrenNames[child.name] = child;
        }
        child.id = Kinetic.GlobalObject.idCounter++;
        child.index = this.children.length;
        child.parent = this;
        this.children.push(child);
    },
    /**
     * remove child from container
     * @param {Node} child
     */
    _remove: function(child){
        this.children.splice(child.index, 1);
        this.setChildrenIndices();
		delete this.childrenNames[child.name];
        child = null;
		delete this.childrenNames[child];
    }
};

///////////////////////////////////////////////////////////////////////
//  Stage
///////////////////////////////////////////////////////////////////////
/**
 * Stage constructor.  Stage extends Container
 * @param {String} containerId
 * @param {int} width
 * @param {int} height
 */
Kinetic.Stage = function(containerId, width, height){
    this.className = "Stage";
    this.container = document.getElementById(containerId);
    this.width = width;
    this.height = height;
    this.scale = {
        x: 1,
        y: 1
    };
    this.dblClickWindow = 400;
    this.targetShape = {};
    this.clickStart = false;
    
    // desktop flags
    this.mousePos = null;
    this.mouseDown = false;
    this.mouseUp = false;
    
    // mobile flags
    this.touchPos = null;
    this.touchStart = false;
    this.touchEnd = false;
    
    /*
     * Layer roles
     *
     * buffer - canvas compositing
     * backstage - path detection
     */
    var that = this;
    this.bufferLayer = new Kinetic.Layer();
    this.backstageLayer = new Kinetic.Layer();
    
    // customize back stage context
    var backstageLayer = this.backstageLayer;
    backstageLayer.context.stroke = function(){
    };
    backstageLayer.context.fill = function(){
    };
    backstageLayer.context.fillRect = function(x, y, width, height){
        backstageLayer.context.rect(x, y, width, height);
    };
    backstageLayer.context.strokeRect = function(x, y, width, height){
        that.context.rect(x, y, width, height);
    };
    backstageLayer.context.drawImage = function(){
    };
    backstageLayer.context.fillText = function(){
    };
    backstageLayer.context.strokeText = function(){
    };
    
    this.bufferLayer.getCanvas().style.display = 'none';
    this.backstageLayer.getCanvas().style.display = 'none';
    
    // add buffer layer
    this.bufferLayer.stage = this;
    this.bufferLayer.canvas.width = this.width;
    this.bufferLayer.canvas.height = this.height;
    this.container.appendChild(this.bufferLayer.canvas);
    
    // add backstage layer
    this.backstageLayer.stage = this;
    this.backstageLayer.canvas.width = this.width;
    this.backstageLayer.canvas.height = this.height;
    this.container.appendChild(this.backstageLayer.canvas);
    
    this.listen();
    
    this.on("mouseout", function(evt){
        that.nodeDragging = undefined;
    }, false);
    
    /*
     * prepare drag and drop
     */
    var types = [{
        end: "mouseup",
        move: "mousemove"
    }, {
        end: "touchend",
        move: "touchmove"
    }];
    
    for (var n = 0; n < types.length; n++) {
        var pubType = types[n];
        (function(){
            var type = pubType;
            that.on(type.move, function(evt){
                if (that.nodeDragging) {
                    var pos = type.move == "mousemove" ? that.getMousePosition() : that.getTouchPosition();
                    if (that.nodeDragging.drag.x) {
                        that.nodeDragging.x = pos.x - that.nodeDragging.offset.x;
                    }
                    if (that.nodeDragging.drag.y) {
                        that.nodeDragging.y = pos.y - that.nodeDragging.offset.y;
                    }
                    that.nodeDragging.layer.draw();
                    
                    // execute user defined ondragend if defined
                    that.nodeDragging.handleEvents("ondragmove", evt);
                }
            }, false);
            that.on(type.end, function(evt){
                // execute user defined ondragend if defined
                if (that.nodeDragging) {
                    that.nodeDragging.handleEvents("ondragend", evt);
                }
                that.nodeDragging = undefined;
            });
        })();
    }
    
    this.on("touchend", function(evt){
        // execute user defined ondragend if defined
        if (that.nodeDragging) {
            that.nodeDragging.handleEvents("ondragend", evt);
        }
        that.nodeDragging = undefined;
    });
    
    // add stage to global object
    var stages = Kinetic.GlobalObject.stages;
    stages.push(this);
    // set stage id
    this.id = stages.length - 1;
    
    // call super constructor
    Kinetic.Container.apply(this, []);
};

/*
 * Stage methods
 */
Kinetic.Stage.prototype = {
    /**
     * draw children
     */
    draw: function(){
        this.drawChildren();
    },
    /**
     * set stage size
     * @param {int} width
     * @param {int} height
     */
    setSize: function(width, height){
        var layers = this.children;
        for (n = 0; n < layers.length; n++) {
            var layer = layers[n];
            layer.getCanvas().width = width;
            layer.getCanvas().height = height;
            layer.draw();
        }
        
        // set stage dimensions
        this.width = width;
        this.height = height;
        
        // set buffer layer and backstage layer sizes
        this.bufferLayer.getCanvas().width = width;
        this.bufferLayer.getCanvas().height = height;
        this.backstageLayer.getCanvas().width = width;
        this.backstageLayer.getCanvas().height = height;
    },
    /**
     * set stage scale
     * @param {int} scaleX
     * @param {int} scaleY
     */
    setScale: function(scaleX, scaleY){
        var oldScaleX = this.scale.x;
        var oldScaleY = this.scale.y;
        
        if (scaleY) {
            this.scale.x = scaleX;
            this.scale.y = scaleY;
        }
        else {
            this.scale.x = scaleX;
            this.scale.y = scaleX;
        }
        
        /*
         * scale all shape positions
         */
        var layers = this.children;
        for (var n = 0; n < layers.length; n++) {
            var children = layers[n].children;
            while (children) {
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    child.x *= this.scale.x / oldScaleX;
                    child.y *= this.scale.y / oldScaleY;
                }
                
                children = child.children;
            }
        }
    },
    /**
     * clear all layers
     */
    clear: function(){
        var layers = this.children;
        for (var n = 0; n < layers.length; n++) {
            layers[n].clear();
        }
    },
    /**
     * creates a composite data URL and passes it to a callback
     * @param {function} callback
     */
    toDataURL: function(callback){
        var bufferLayer = this.bufferLayer;
        var bufferContext = bufferLayer.getContext();
        var layers = this.children;
        
        function addLayer(n){
            var dataURL = layers[n].getCanvas().toDataURL();
            var imageObj = new Image();
            imageObj.onload = function(){
                bufferContext.drawImage(this, 0, 0);
                n++;
                if (n < layers.length) {
                    addLayer(n);
                }
                else {
                    callback(bufferLayer.getCanvas().toDataURL());
                }
            };
            imageObj.src = dataURL;
        }
        
        
        bufferLayer.clear();
        addLayer(0);
    },
    /**
     * remove layer from stage
     * @param {Layer} layer
     */
    remove: function(layer){
        this._remove(layer);
        // remove layer canvas from dom
        this.container.removeChild(layer.canvas);
    },
    /**
     * bind event listener to stage (which is essentially
     * the container DOM)
     * @param {string} type
     * @param {function} handler
     */
    on: function(type, handler){
        this.container.addEventListener(type, handler);
    },
    /** 
     * add layer to stage
     * @param {Layer} layer
     */
    add: function(layer){
        if (layer.name) {
            this.childrenNames[layer.name] = layer;
        }
        layer.canvas.width = this.width;
        layer.canvas.height = this.height;
        layer.stage = this;
        layer.layer = layer;
        this._add(layer);
        var that = this;
        
        // traverse children and set layer pointer
        function setLayerPointers(obj){
            for (var n = 0; n < obj.children.length; n++) {
                var child = obj.children[n];
                child.layer = layer;
                child.stage = that;
                if (child.className != "Shape") {
                    setLayerPointers(child);
                }
            }
        }
        
        setLayerPointers(layer);
        
        // draw layer and append canvas to container
        layer.draw();
        this.container.appendChild(layer.canvas);
    },
    /**
     * get layer by name
     * @param {string} name
     */
    getLayer: function(name){
        return this.childrenNames[name];
    },
    /**
     * handle incoming event
     * @param {Event} evt
     */
    handleEvent: function(evt){
        if (!evt) {
            evt = window.event;
        }
        
        this.setMousePosition(evt);
        this.setTouchPosition(evt);
        
        var backstageLayer = this.backstageLayer;
        var backstageLayerContext = backstageLayer.getContext();
        var that = this;
        
        backstageLayer.clear();
        
        /*
         * loop through layers.  If at any point an event
         * is triggered, n is set to -1 which will break out of the
         * three nested loops
         */
        var nodesCounted = 0;
        
        function detectEvent(shape){
            shape.draw(backstageLayer);
            var pos = that.getUserPosition();
            var el = shape.eventListeners;
            
            if (shape.visible && pos !== null && backstageLayerContext.isPointInPath(pos.x, pos.y)) {
                // handle onmousedown
                if (that.mouseDown) {
                    that.mouseDown = false;
                    that.clickStart = true;
                    shape.handleEvents("onmousedown", evt);
                    return true;
                }
                // handle onmouseup & onclick
                else if (that.mouseUp) {
                    that.mouseUp = false;
                    shape.handleEvents("onmouseup", evt);
                    
                    // detect if click or double click occurred
                    if (that.clickStart) {
                        shape.handleEvents("onclick", evt);
                        
                        if (shape.inDoubleClickWindow) {
                            shape.handleEvents("ondblclick", evt);
                        }
                        shape.inDoubleClickWindow = true;
                        setTimeout(function(){
                            shape.inDoubleClickWindow = false;
                        }, that.dblClickWindow);
                    }
                    return true;
                }
                
                // handle touchstart
                else if (that.touchStart) {
                    that.touchStart = false;
                    shape.handleEvents("touchstart", evt);
                    
                    if (el.ondbltap && shape.inDoubleClickWindow) {
                        var events = el.ondbltap;
                        for (var i = 0; i < events.length; i++) {
                            events[i].handler.apply(shape, [evt]);
                        }
                    }
                    
                    shape.inDoubleClickWindow = true;
                    
                    setTimeout(function(){
                        shape.inDoubleClickWindow = false;
                    }, that.dblClickWindow);
                    return true;
                }
                
                // handle touchend
                else if (that.touchEnd) {
                    that.touchEnd = false;
                    shape.handleEvents("touchend", evt);
                    return true;
                }
                
                // handle touchmove
                else if (el.touchmove) {
                    shape.handleEvents("touchmove", evt);
                    return true;
                }
                
                /*
                 * this condition is used to identify a new target shape.
                 * A new target shape occurs if a target shape is not defined or
                 * if the current shape is different from the current target shape and
                 * the current shape is beneath the target
                 */
                else if (that.targetShape.id === undefined || (that.targetShape.id != shape.id && that.targetShape.getZIndex() < shape.getZIndex())) {
                    /*
                     * check if old target has an onmouseout event listener
                     */
                    var oldEl = that.targetShape.eventListeners;
                    if (oldEl) {
                        that.targetShape.handleEvents("onmouseout", evt);
                    }
                    
                    // set new target shape
                    that.targetShape = shape;
                    
                    // handle onmouseover
                    shape.handleEvents("onmouseover", evt);
                    return true;
                }
                
                // handle onmousemove
                else {
                    shape.handleEvents("onmousemove", evt);
                    return true;
                }
            }
            // handle mouseout condition
            else if (that.targetShape.id == shape.id) {
                that.targetShape = {};
                shape.handleEvents("onmouseout", evt);
                return true;
            }
            
            return false;
        }
        
        function traverseChildren(obj){
            var children = obj.children;
            // propapgate backwards through children
            for (var i = children.length - 1; i >= 0; i--) {
                nodesCounted++;
                var child = children[i];
                if (child.className == "Shape") {
                    var exit = detectEvent(child);
                    if (exit) {
                        return true;
                    }
                }
                else {
                    traverseChildren(child);
                }
            }
            
            return false;
        }
        
        for (var n = this.children.length - 1; n >= 0; n--) {
            var layer = this.children[n];
            if (layer.visible && n >= 0 && layer.isListening) {
                if (traverseChildren(layer)) {
                    n = -1;
                }
            }
        }
    },
    /**
     * begin listening for events by adding event handlers
     * to the container
     */
    listen: function(){
        var that = this;
        
        // desktop events
        this.container.addEventListener("mousedown", function(evt){
            that.mouseDown = true;
            that.handleEvent(evt);
        }, false);
        
        this.container.addEventListener("mousemove", function(evt){
            that.mouseUp = false;
            that.mouseDown = false;
            that.handleEvent(evt);
        }, false);
        
        this.container.addEventListener("mouseup", function(evt){
            that.mouseUp = true;
            that.mouseDown = false;
            that.handleEvent(evt);
            
            that.clickStart = false;
        }, false);
        
        this.container.addEventListener("mouseover", function(evt){
            that.handleEvent(evt);
        }, false);
        
        this.container.addEventListener("mouseout", function(evt){
            that.mousePos = null;
        }, false);
        // mobile events
        this.container.addEventListener("touchstart", function(evt){
            evt.preventDefault();
            that.touchStart = true;
            that.handleEvent(evt);
        }, false);
        
        this.container.addEventListener("touchmove", function(evt){
            evt.preventDefault();
            that.handleEvent(evt);
        }, false);
        
        this.container.addEventListener("touchend", function(evt){
            evt.preventDefault();
            that.touchEnd = true;
            that.handleEvent(evt);
        }, false);
    },
    /**
     * get mouse position for desktop apps
     * @param {Event} evt
     */
    getMousePosition: function(evt){
        return this.mousePos;
    },
    /**
     * get touch position for mobile apps
     * @param {Event} evt
     */
    getTouchPosition: function(evt){
        return this.touchPos;
    },
    /**
     * get user position (mouse position or touch position)
     * @param {Event} evt
     */
    getUserPosition: function(evt){
        return this.getTouchPosition() || this.getMousePosition();
    },
    /**
     * set mouse positon for desktop apps
     * @param {Event} evt
     */
    setMousePosition: function(evt){
        var mouseX = evt.clientX - this.getContainerPosition().left + window.pageXOffset;
        var mouseY = evt.clientY - this.getContainerPosition().top + window.pageYOffset;
        this.mousePos = {
            x: mouseX,
            y: mouseY
        };
    },
    /**
     * set touch position for mobile apps
     * @param {Event} evt
     */
    setTouchPosition: function(evt){
        if (evt.touches !== undefined && evt.touches.length == 1) {// Only deal with
            // one finger
            var touch = evt.touches[0];
            // Get the information for finger #1
            var touchX = touch.clientX - this.getContainerPosition().left + window.pageXOffset;
            var touchY = touch.clientY - this.getContainerPosition().top + window.pageYOffset;
            
            this.touchPos = {
                x: touchX,
                y: touchY
            };
        }
    },
    /**
     * get container position
     */
    getContainerPosition: function(){
        var obj = this.container;
        var top = 0;
        var left = 0;
        while (obj && obj.tagName != "BODY") {
            top += obj.offsetTop;
            left += obj.offsetLeft;
            obj = obj.offsetParent;
        }
        return {
            top: top,
            left: left
        };
    },
    /**
     * get container DOM element
     */
    getContainer: function(){
        return this.container;
    }
};
// extend Container
Kinetic.GlobalObject.extend(Kinetic.Stage, Kinetic.Container);

///////////////////////////////////////////////////////////////////////
//  Layer
///////////////////////////////////////////////////////////////////////
/** 
 * Layer constructor.  Layer extends Container and Node
 * @param {string} name
 */
Kinetic.Layer = function(name){
    this.className = "Layer";
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.style.position = 'absolute';
    
    // call super constructors
    Kinetic.Container.apply(this, []);
    Kinetic.Node.apply(this, [name]);
};
/*
 * Layer methods
 */
Kinetic.Layer.prototype = {
    /**
     * draw children
     */
    draw: function(){
        this.clear();
        this.drawChildren.call(this);
    },
    /**
     * clear layer
     */
    clear: function(){
        var context = this.getContext();
        var canvas = this.getCanvas();
        context.clearRect(0, 0, canvas.width, canvas.height);
    },
    /**
     * get layer canvas
     */
    getCanvas: function(){
        return this.canvas;
    },
    /**
     * get layer context
     */
    getContext: function(){
        return this.context;
    },
    /**
     * add node to layer
     * @param {Node} node
     */
    add: function(child){
        this._add(child);
    },
    /**
     * remove a child from the layer
     * @param {Node} child
     */
    remove: function(child){
        this._remove(child);
    }
};
// Extend Container and Node
Kinetic.GlobalObject.extend(Kinetic.Layer, Kinetic.Container);
Kinetic.GlobalObject.extend(Kinetic.Layer, Kinetic.Node);

///////////////////////////////////////////////////////////////////////
//  Group
///////////////////////////////////////////////////////////////////////

/**
 * Group constructor.  Group extends Container and Node
 * @param {String} name
 */
Kinetic.Group = function(name){
    this.className = "Group";
    
    // call super constructors
    Kinetic.Container.apply(this, []);
    Kinetic.Node.apply(this, [name]);
};

Kinetic.Group.prototype = {
    /**
     * draw children
     */
    draw: function(){
        this.drawChildren();
    },
    /**
     * add node to group
     * @param {Node} child
     */
    add: function(child){
        this._add(child);
    },
    /**
     * remove a child from the group
     * @param {Node} child
     */
    remove: function(child){
        this._remove(child);
    }
};

// Extend Container and Node
Kinetic.GlobalObject.extend(Kinetic.Group, Kinetic.Container);
Kinetic.GlobalObject.extend(Kinetic.Group, Kinetic.Node);

///////////////////////////////////////////////////////////////////////
//  Shape
///////////////////////////////////////////////////////////////////////
/**
 * Shape constructor.  Shape extends Node
 * @param {function} drawFunc
 * @param {string} name
 */
Kinetic.Shape = function(drawFunc, name){
    this.className = "Shape";
    this.drawFunc = drawFunc;
    
    // call super constructor
    Kinetic.Node.apply(this, [name]);
};
/*
 * Shape methods
 */
Kinetic.Shape.prototype = {
    /**
     * get shape temp layer context
     */
    getContext: function(){
        return this.tempLayer.getContext();
    },
    /**
     * get shape temp layer canvas
     */
    getCanvas: function(){
        return this.tempLayer.getCanvas();
    },
    /**
     * draw shape
     * @param {Layer} layer
     */
    draw: function(layer){
		layer = this.parent
        if (this.visible) {
            var stage = layer.stage;
            var context = layer.getContext();
            
            var family = [];
            
            family.unshift(this);
            var parent = this.parent;
            while (parent.className !== "Stage") {
                family.unshift(parent);
                parent = parent.parent;
            }
            
            // children transforms
            for (var n = 0; n < family.length; n++) {
                var obj = family[n];
                
                context.save();
                if (obj.x !== 0 || obj.y !== 0) {
                    context.translate(obj.x, obj.y);
                }
                if (obj.rotation !== 0) {
                    context.rotate(obj.rotation);
                }
                if (obj.scale.x != 1 || obj.scale.y != 1) {
                    context.scale(obj.scale.x, obj.scale.y);
                }
            }
            
            // stage transform
            context.save();
            if (stage.scale.x != 1 || stage.scale.y != 1) {
                context.scale(stage.scale.x, stage.scale.y);
            }
            
            this.tempLayer = layer;
            this.drawFunc.call(this);
            
            // children restore
            for (var n = 0; n < family.length; n++) {
                context.restore();
            }
            
            // stage restore
            context.restore();
        }
    }
};
// extend Node
Kinetic.GlobalObject.extend(Kinetic.Shape, Kinetic.Node);