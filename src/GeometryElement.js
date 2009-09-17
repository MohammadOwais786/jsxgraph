/*
    Copyright 2008,2009
        Matthias Ehmann,
        Michael Gerhaeuser,
        Carsten Miller,
        Bianca Valentin,
        Alfred Wassermann,
        Peter Wilfahrt

    This file is part of JSXGraph.

    JSXGraph is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    JSXGraph is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with JSXGraph.  If not, see <http://www.gnu.org/licenses/>.
*/
JXG.OBJECT_TYPE_ARC  = 0x4F544143;                 // Hex fuer OTAC = Object Type ArC
JXG.OBJECT_TYPE_ARROW  = 0x4F544157;                 // Hex fuer OTAW = Object Type ArroW
JXG.OBJECT_TYPE_AXIS  = 0x4F544158;                 // Hex fuer OTAX = Object Type AXis
JXG.OBJECT_TYPE_TICKS  = 0x4F545458;                 // Hex fuer OTTX = Object Type TiX
JXG.OBJECT_TYPE_CIRCLE  = 0x4F54434C;                 // Hex fuer OTCC = Object Type CirCle 
JXG.OBJECT_TYPE_CURVE  = 0x4F544750;                 // Hex fuer OTGP = Object Type GraphPlot 
JXG.OBJECT_TYPE_GLIDER  = 0x4F54474C;                 // Hex fuer OTGL = Object Type GLider
JXG.OBJECT_TYPE_IMAGE  = 0x4F54524D;                 // Hex fuer OTIM = Object Type IMage
JXG.OBJECT_TYPE_LINE  = 0x4F544C4E;                 // Hex fuer OTLN = Object Type LiNe
JXG.OBJECT_TYPE_POINT  = 0x4F545054;                 // Hex fuer OTPT = Object Type PoinT
JXG.OBJECT_TYPE_SLIDER = 0x4F545344;                 // Hex fuer OTSD = Object Type SliDer
JXG.OBJECT_TYPE_CAS    = 0x4F544350;                 // Hex fuer OTCP = Object Type CasPoint
JXG.OBJECT_TYPE_POLYGON  = 0x4F545059;                 // Hex fuer OTPY = Object Type PolYgon
JXG.OBJECT_TYPE_SECTOR  = 0x4F545343;                 // Hex fuer OTSC = Object Type SeCtor
JXG.OBJECT_TYPE_TEXT  = 0x4F545445;                 // Hex fuer OTTE = Object Type TextElement 
JXG.OBJECT_TYPE_ANGLE = 0x4F544147;                 // Hex fuer OTAG = Object Type AnGle
JXG.OBJECT_TYPE_INTERSECTION = 0x4F54524E;          // Hex fuer OTIN = Object Type INtersection 
JXG.OBJECT_TYPE_TURTLE = 0x4F5455;                 // Hex fuer OTTU = Object Type TUrtle

JXG.OBJECT_CLASS_POINT = 1;                
JXG.OBJECT_CLASS_LINE = 2;                
JXG.OBJECT_CLASS_CIRCLE = 3;                
JXG.OBJECT_CLASS_CURVE = 4;                
JXG.OBJECT_CLASS_AREA = 5;                
JXG.OBJECT_CLASS_OTHER = 6;                
 
/**
 * Constructs a new GeometryElement object.
 * @class This is the basic class for geometry elements like points, circles and lines.
 * @constructor
 * of identical elements on the board. Is not yet implemented for all elements, only points, lines and circle can be traced.
 */
JXG.GeometryElement = function() {
    /**
     * Reference to board where the element is drawn
     * @type JXG.Board
     * @default null
     * @see JXG.Board
     * @private
     */
    this.board = null;

    /**
     * Unique identifier for the element. Equivalent to id-attribute of renderer element.
     * @type String
     * @default empty string
     * @private
     */
    this.id = '';

    /**
     * Controls if updates are necessary
     * @type bool
     * @default true
     * @private
     */
    this.needsUpdate = true;
    
    /**
     * Not necessarily unique name for the element.
     * @type String
     * @default Name generated by {@link JXG.Board#generateName}.
     * @see JXG.Board#generateName
     */
    this.name = '';
    
    /**
     * An associative array containing all visual properties.
     * @type Object
     * @default empty object
     * @private
     */
    this.visProp = {};

    /**
     * If element is in two dimensional real space this is true, else false.
     * @type boolean
     * @default true
     * @private
     */
    this.isReal = true;

    /** 
     * Determines the elements border-style.
     * Possible values are:
     * <ul><li>0 for a solid line</li>
     * <li>1 for a dotted line</li>
     * <li>2 for a line with small dashes</li>
     * <li>3 for a line with medium dashes</li>
     * <li>4 for a line with big dashes</li>
     * <li>5 for a line with alternating medium and big dashes and large gaps</li>
     * <li>6 for a line with alternating medium and big dashes and small gaps</li></ul>
     * @type number
     * @name JXG.GeometryElement#dash
     * @default 0
     */
    this.visProp['dash'] = 0;
    
    /**
     * Stores all dependent objects to be updated when this point is moved.
     * @type Object
     * @private
     */
    this.childElements = {};
    
    /**
     * If element has a label subelement then this property will be set to true.
     * @type boolean
     * @default false
     * @private
     */
    this.hasLabel = false;
    
    
    /** 
     * Stores all Intersection Objects which in this moment are not real and
     * so hide this element.
     * @type object
     * @private
     */
    this.notExistingParents = {};
    
    /**
     * If true the element will be traced, i.e. on every movement the element will be copied
     * to the background. Use {@link #clearTrace} to delete the trace elements.
     * @see #clearTrace
     * @see #traces
     * @see #numTraces
     * @type boolean
     * @default false
     * @name JXG.GeometryElement#trace
     */
    this.traced = false;
    
    /**
     * Keeps track of all objects drawn as part of the trace of the element.
     * @see #traced
     * @see #clearTrace
     * @see #numTraces
     * @type Object
     * @private
     */
    this.traces = {};
    
    /**
     * Counts the number of objects drawn as part of the trace of the element.
     * @see #traced
     * @see #clearTrace
     * @see #traces
     * @type number
     * @private
     */
    this.numTraces = 0;

    /**
     * Stores the  transformations which are applied during update in an array
     * @type Array
     * @see JXG.Transformation
     * @private
     */
    this.transformations = [];

    /** TODO
     * @type TODO
     * @default null
     * @private
     */
    this.baseElement = null;

    /**
     * Elements depending on this element are stored here.
     * @type object
     * @private
     */
    this.descendants = {};

    /**
     * Elements on which this elements depends on are stored here.
     * @type object
     * @private
     */
    this.ancestors = {};

    /**
     * Stores variables for symbolic computations
     * @type Object
     * @private
     */
    this.symbolic = {};

    /**
     * [c,b0,b1,a,k,r,q0,q1]
     *
     * See
     * A.E. Middleditch, T.W. Stacey, and S.B. Tor:
     * "Intersection Algorithms for Lines and Circles", 
     * ACM Transactions on Graphics, Vol. 8, 1, 1989, pp 25-40.
     *
     * The meaning of the parameters is:
     * Circle: points p=[p0,p1] on the circle fulfill
     *  a&lt;p,p&gt; + &lt;b,p&gt; + c = 0
     * For convenience we also store
     *  r: radius
     *  k: discriminant = sqrt(&lt;b,b&gt;-4ac)
     *  q=[q0,q1] center
     *
     * Points have radius = 0.
     * Lines have radius = infinity.
     * b: normalized vector, representing the direction of the line.
     *
     * Should be put into Coords, when all elements possess Coords.
     * @type array
     * @default [1, 0, 0, 0, 1, 1, 0, 0]
     * @private
     */
    this.stdform = [1,0,0,0,1, 1,0,0];
    
    /**
     * If this is set to true, the element is updated in every update 
     * call of the board. If set to false, the element is updated only after
     * zoom events or more generally, when the bounding box has been changed.
     * Examples for the latter behaviour should be axes.
     * 
     * @type boolean
     * @default true
     * @private
     */
    this.needsRegularUpdate = true;

};

/**
 * Initializes board, id and name which cannot be initialized properly in the constructor.
 * @param {String,JXG.Board} board The board the new point is drawn on.
 * @param {String} id Unique identifier for the point. If null or an empty string is given,
 *  an unique id will be generated by Board
 * @param {String} name Not necessarily unique name for the point. If null or an
 *  empty string is given, an unique name will be generated
 * @private
 */
JXG.GeometryElement.prototype.init = function(board, id, name) {
    /*
     * Parameter magic, if board is a string, assume it is an if of an object of
     * type Board an get the boards reference.
     */
    if (typeof(board) == 'string') {
        board = JXG.JSXGraph.boards[board];
    }
    
    /* already documented in constructor */
    this.board = board;

    /* already documented in constructor */
    this.id = id;

    /* If name is not set or null or even undefined, generate an unique name for this object */
    if ( /*(name != '') &&*/ (name != null) && (typeof name != 'undefined') ) {
        name = name;
    } else {
        name = this.board.generateName(this);
    }
    this.board.elementsByName[name] = this;

    /* already documented in constructor */
    this.name = name;

    /**
     * The stroke color of the given geometry element.
     * @type string
     * @name JXG.GeometryElement#strokeColor
     * @see #highlightStrokeColor
     * @see #strokeWidth
     * @see #strokeOpacity
     * @see #highlightStrokeOpacity
     * @default {@link JXG.Options.elements.color#strokeColor}
     */
    this.visProp.strokeColor = this.board.options.elements.color.strokeColor; //'#36393D';

    /**
     * The stroke color of the given geometry element when the user moves the mouse over it.
     * @type string
     * @name JXG.GeometryElement#highlightStrokeColor
     * @see #sstrokeColor
     * @see #strokeWidth
     * @see #strokeOpacity
     * @see #highlightStrokeOpacity
     * @default {@link JXG.Options.elements.color#highlightStrokeColor}
     */
    this.visProp.highlightStrokeColor = this.board.options.elements.color.highlightStrokeColor;

    /**
     * The fill color of this geometry element.
     * @type string
     * @name JXG.GeometryElement#fillColor
     * @see #highlightFillColor
     * @see #fillOpacity
     * @see #highlightFillOpacity
     * @default {@link JXG.Options.elements.color#fillColor}
     */
    this.visProp.fillColor = this.board.options.elements.color.fillColor;

    /**
     * The fill color of the given geometry element when the mouse is pointed over it.
     * @type string
     * @name JXG.GeometryElement#highlightFillColor
     * @see #fillColor
     * @see #fillOpacity
     * @see #highlightFillOpacity
     * @default {@link JXG.Options.elements.color#highlightFillColor}
     */
    this.visProp.highlightFillColor = this.board.options.elements.color.highlightFillColor;

    /**
     * Width of the element's stroke.
     * @type number
     * @name JXG.GeometryElement#strokeWidth
     * @see #strokeColor
     * @see #highlightStrokeColor
     * @see #strokeOpacity
     * @see #highlightStrokeOpacity
     * @default {@link JXG.Options.elements#strokeWidth}
     */
    this.visProp.strokeWidth = this.board.options.elements.strokeWidth;
    
    /**
     * Opacity for element's stroke color.
     * @type number
     * @name JXG.GeometryElement#strokeOpacity
     * @see #strokeColor
     * @see #highlightStrokeColor
     * @see #strokeWidth
     * @see #highlightStrokeOpacity
     * @default {@link JXG.Options.elements#strokeOpacity}
     */
    this.visProp.strokeOpacity = this.board.options.elements.color.strokeOpacity;

    /**
     * Opacity for stroke color when the object is highlighted.
     * @type number
     * @name JXG.GeometryElement#highlightStrokeOpacity
     * @see #strokeColor
     * @see #highlightStrokeColor
     * @see #strokeWidth
     * @see #strokeOpacity
     * @default {@link JXG.Options.elements#highlightStrokeOpacity}
     */
    this.visProp.highlightStrokeOpacity = this.board.options.elements.color.highlightStrokeOpacity;

    /**
     * Opacity for fill color.
     * @type number
     * @name JXG.GeometryElement#fillOpacity
     * @see #fillColor
     * @see #highlightFillColor
     * @see #highlightFillOpacity
     * @default {@link JXG.Options.elements.color#fillOpacity}
     */
    this.visProp.fillOpacity = this.board.options.elements.color.fillOpacity;

    /**
     * Opacity for fill color when the object is highlighted.
     * @type number
     * @name JXG.GeometryElement#highlightFillOpacity
     * @see #fillColor
     * @see #highlightFillColor
     * @see #fillOpacity
     * @default {@link JXG.Options.elements.color#highlightFillOpacity}
     */
    this.visProp.highlightFillOpacity = this.board.options.elements.color.highlightFillOpacity;
    
    /**
     * If true the element will be drawn in grey scale colors to visualize that it's only a draft.
     * @type boolean
     * @name JXG.GeometryElement#draft
     * @default {@link JXG.Options.elements.draft#draft}
     */
    this.visProp.draft = this.board.options.elements.draft.draft;

    /**
     * If false the element won't be visible on the board, otherwise it is shown.
     * @type boolean
     * @name JXG.GeometryElement#visible
     * @see #hideElement
     * @see #showElement
     * @default true
     */
    this.visProp.visible = true;

    /**
     * If true the element will get a shadow.
     * @type boolean
     * @name JXG.GeometryElement#shadow
     * @default false
     */
    this.visProp['shadow'] = false;
    
    // TODO: withLabel
    
    // TODO: comment
    this.visProp['gradient'] = 'none';
    this.visProp['gradientSecondColor'] = 'black';
    this.visProp['gradientAngle'] = '270';
    this.visProp['gradientSecondOpacity'] = this.visProp['fillOpacity'];
    this.visProp['gradientPositonX'] = 0.5;
    this.visProp['gradientPositonY'] = 0.5;    
};

/**
 * Add an element as a child to the current element. Can be used to model dependencies between geometry elements.
 * @param {JXG.GeometryElement} obj The dependent object.
 */
JXG.GeometryElement.prototype.addChild = function (obj) {
	var el, el2;
	
    this.childElements[obj.id] = obj;
    
    this.addDescendants(obj);
    
    obj.ancestors[this.id] = this;
    for(el in this.descendants) {
        this.descendants[el].ancestors[this.id] = this;
        for(el2 in this.ancestors) {
            this.descendants[el].ancestors[this.ancestors[el2].id] = this.ancestors[el2];
        }
    }
    for(el in this.ancestors) {
        for(el2 in this.descendants) {
            this.ancestors[el].descendants[this.descendants[el2].id] = this.descendants[el2];
        }
    }
};

/**
 * Adds the given object to the descendants list of this object and all its child objects.
 * @param obj The element that is to be added to the descendants list.
 * @private
 * @return
 */
JXG.GeometryElement.prototype.addDescendants = function (/** JXG.GeometryElement */ obj) {
	var el;
	
    this.descendants[obj.id] = obj;
    for(el in obj.childElements) {
        this.addDescendants(obj.childElements[el]);
    }
};

/**
 * Array of strings containing the polynomials defining the element.
 * Used for determining geometric loci the groebner way.
 * @type array
 * @return An array containing polynomials describing the locus of the current object.
 * @private
 */
JXG.GeometryElement.prototype.generatePolynomial = function () {
    return [];
};

/**
 * General update method. Should be overwritten by the element itself.
 * Can be used sometimes to commit changes to the object.
 */
JXG.GeometryElement.prototype.update = function() {
    if(this.traced) {
        this.cloneToBackground(true);
    }
};

/**
 * Provide updateRenderer method.
 * @private
 */
JXG.GeometryElement.prototype.updateRenderer = function() {
};

/**
 * Hide the element. It will still exist but not visible on the board.
 */
JXG.GeometryElement.prototype.hideElement = function() {
    this.visProp['visible'] = false;
    this.board.renderer.hide(this);
    if (this.label!=null && this.hasLabel) {
        this.label.hiddenByParent = true;
        if(this.label.content.visProp['visible']) {
            this.board.renderer.hide(this.label.content);
        }
    }
};

/**
 * Make the element visible.
 */
JXG.GeometryElement.prototype.showElement = function() {
    this.visProp['visible'] = true;
    this.board.renderer.show(this);
    if (this.label!=null && this.hasLabel && this.label.hiddenByParent) {
        this.label.hiddenByParent = false;
        if(this.label.content.visProp['visible']) {
            this.board.renderer.show(this.label.content);
        }
    }
};


/* this list is left from the comment below. just to have a list of properties.
* <ul>Possible keys:</ul>
*<li>strokeWidth</li>
*<li>strokeColor</li>
*<li>fillColor</li> 
*<li>highlightFillColor</li>
*<li>highlightStrokeColor</li>
*<li>strokeOpacity</li>
*<li>fillOpacity</li> 
*<li>highlightFillOpacity</li>
*<li>highlightStrokeOpacity</li> 
*<li>labelColor</li>
*<li>visible</li>
*<li>dash</li>
*<li>trace</li>
*<li>style <i>(Point)</i></li>
*<li>fixed</li>
*<li>draft</li>
*<li>showInfobox</li>
*<li>straightFirst <i>(Line)</i></li>
*<li>straightLast <i>(Line)</i></li>
*<li>firstArrow <i>(Line,Arc)</li>
*<li>lastArrow <i>(Line,Arc)</li>
*<li>withTicks <i>(Line)</li>
*</ul>*/

/**
 * Sets an arbitrary number of properties.
 * @param % Arbitrary number of strings, containing "key:value" pairs.
 * The possible key values are the element and class fields in this documentation.
 * @example
 * // Set property directly on creation of an element using the attributes object parameter
 * var board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [-1, 5, 5, 1]};
 * var p = board.createElement('point', [2, 2], {visible: false});
 * 
 * // Now make this point visible and fixed:
 * p.setProperty('fixed:true', 'visible:true');
 * 
 * // Alternatively you can use #hideElement resp. #showElement:
 * p.hideElement();
 */
JXG.GeometryElement.prototype.setProperty = function () {
    var color;
    var opacity;
    var pair;
    for (var i=0; i<arguments.length; i++) {
        var pairRaw = arguments[i];
        if (typeof pairRaw == 'string') {    // pairRaw is string of the form 'key:value'
            pair = pairRaw.split(':');
        } else if (!JXG.isArray(pairRaw)) {    // pairRaw consists of objects of the form {key1:value1,key2:value2,...}
            /*
            for (var i=0; i<Object.keys(pairRaw).length;i++) {  // Here, the prototype lib is used (Object.keys, Object.isArray)
                var key = Object.keys(pairRaw)[i];
                this.setProperty([key,pairRaw[key]]);
            }
            */
            for (var key in pairRaw) {
                this.setProperty([key,pairRaw[key]]);
            }
            return;
        } else {                             // pairRaw consists of array [key,value]
            pair = pairRaw;
        }     
        switch(pair[0].replace(/\s+/g).toLowerCase()) {   // Whitespace entfernt und in Kleinbuchstaben umgewandelt.
            case 'strokewidth':
                this.visProp['strokeWidth'] = pair[1];
                this.board.renderer.setObjectStrokeWidth(this, this.visProp['strokeWidth']);
                break;
            case 'strokecolor':
                color = pair[1];                
                if (color.length=='9' && color.substr(0,1)=='#') {
                    opacity = color.substr(7,2);                
                    color = color.substr(0,7);
                }
                else { 
                    opacity = 'FF';
                }
                this.visProp['strokeColor'] = color;
                this.visProp['strokeOpacity'] = parseInt(opacity.toUpperCase(),16)/255;
                this.board.renderer.setObjectStrokeColor(this, this.visProp['strokeColor'], this.visProp['strokeOpacity']);                
                break;
            case 'fillcolor':          
                color = pair[1];             
                if (color.length=='9' && color.substr(0,1)=='#') {
                    opacity = color.substr(7,2);
                    color = color.substr(0,7);
                }
                else { 
                    opacity = 'FF';
                }                
                this.visProp['fillColor'] = color;
                this.visProp['fillOpacity'] = parseInt(opacity.toUpperCase(),16)/255;             
                this.board.renderer.setObjectFillColor(this, this.visProp['fillColor'], this.visProp['fillOpacity']);               
                break;
            case 'highlightstrokecolor':
                color = pair[1];
                if (color.length=='9' && color.substr(0,1)=='#') {
                    opacity = color.substr(7,2);
                    color = color.substr(0,7);
                }
                else {
                    opacity = 'FF';
                }
                this.visProp['highlightStrokeColor'] = color;
                this.visProp['highlightStrokeOpacity'] = parseInt(opacity.toUpperCase(),16)/255;                
                break;
            case 'highlightfillcolor':
                color = pair[1];
                if (color.length=='9' && color.substr(0,1)=='#') {
                    opacity = color.substr(7,2);
                    color = color.substr(0,7);
                }
                else {
                    opacity = 'FF';
                }
                this.visProp['highlightFillColor'] = color;
                this.visProp['highlightFillOpacity'] = parseInt(opacity.toUpperCase(),16)/255;                
                break;
            case 'fillopacity':
                this.visProp['fillOpacity'] = pair[1];
                this.board.renderer.setObjectFillColor(this, this.visProp['fillColor'], this.visProp['fillOpacity']);                
                break;
            case 'strokeopacity':
                this.visProp['strokeOpacity'] = pair[1];
                this.board.renderer.setObjectStrokeColor(this, this.visProp['strokeColor'], this.visProp['strokeOpacity']);                 
                break;        
            case 'highlightfillopacity':
                this.visProp['highlightFillOpacity'] = pair[1];
                break;
            case 'highlightstrokeopacity':
                this.visProp['highlightStrokeOpacity'] = pair[1];
                break;
            case 'labelcolor': 
                color = pair[1];
                if (color.length=='9' && color.substr(0,1)=='#') {
                    opacity = color.substr(7,2);
                    color = color.substr(0,7);
                }
                else {
                    opacity = 'FF';
                }
                if(opacity == '00') {
                    if (this.label!=null && this.hasLabel) {
                        this.label.content.hideElement();
                    }
                } 
                if(this.label!=null && this.hasLabel) {
                    this.label.color = color;
                    this.board.renderer.setObjectStrokeColor(this.label.content, color, opacity);  
                }
                if(this.type == JXG.OBJECT_TYPE_TEXT) {
                    this.visProp['strokeColor'] = color;
                    this.board.renderer.setObjectStrokeColor(this, this.visProp['strokeColor'], 1);    
                }
                break;            
            case 'showinfobox':
                if(pair[1] == 'false' || pair[1] == false) {
                    this.showInfobox = false;
                }
                else if(pair[1] == 'true' || pair[1] == true) {
                    this.showInfobox = true;
                }
                break;
            case 'visible':
                if(pair[1] == 'false' || pair[1] == false) {
                    this.visProp['visible'] = false;
                    this.hideElement();
                }
                else if(pair[1] == 'true' || pair[1] == true) {
                    this.visProp['visible'] = true;
                    this.showElement();
                }
                break;
            case 'dash':
                this.setDash(pair[1]);
                break;
            case 'trace':
                if(pair[1] == 'false' || pair[1] == false) {
                    this.traced = false;
                }
                else if(pair[1] == 'true' || pair[1] == true) {
                    this.traced = true;
                }
                break;
            case 'style':
                this.setStyle(1*pair[1]);
                break;
            case 'face':
                this.setFace(pair[1]);
                break;
            case 'size':
                this.visProp['size'] = 1*pair[1];
                this.board.renderer.updatePoint(this);
                break;  
            case 'fixed':          
                this.fixed = (pair[1]=='false') ? false : true;
                break;
            case 'shadow':
                if(pair[1] == 'false' || pair[1] == false) {
                    this.visProp['shadow'] = false;
                }
                else if(pair[1] == 'true' || pair[1] == true) {
                    this.visProp['shadow'] = true;                
                }  
                this.board.renderer.setShadow(this);
                break;
            case 'gradient':
                this.visProp['gradient'] = pair[1];
                this.board.renderer.setGradient(this);
                break;                
            case 'draft': 
                if(pair[1] == 'false' || pair[1] == false) {
                    if(this.visProp['draft'] == true) {
                        this.visProp['draft'] = false;
                        this.board.renderer.removeDraft(this);
                    }
                }
                else if(pair[1] == 'true' || pair[1] == true) {
                    this.visProp['draft'] = true;
                    this.board.renderer.setDraft(this);
                }            
                break;
            case 'straightfirst':
                if(pair[1] == 'false' || pair[1] == false) {
                    this.visProp['straightFirst'] = false;
                }
                else if(pair[1] == 'true' || pair[1] == true) {
                    this.visProp['straightFirst'] = true;
                }    
                this.setStraight(this.visProp['straightFirst'], this.visProp['straightLast']);
                break;    
            case 'straightlast':
                if(pair[1] == 'false' || pair[1] == false) {
                    this.visProp['straightLast'] = false;
                }
                else if(pair[1] == 'true' || pair[1] == true) {
                    this.visProp['straightLast'] = true;
                }            
                this.setStraight(this.visProp['straightFirst'], this.visProp['straightLast']);
                break;    
            case 'firstarrow':
                if(pair[1] == 'false' || pair[1] == false) {
                    this.visProp['firstArrow'] = false;
                }
                else if(pair[1] == 'true' || pair[1] == true) {
                    this.visProp['firstArrow'] = true;
                }    
                this.setArrow(this.visProp['firstArrow'], this.visProp['lastArrow']);
                break;    
            case 'lastarrow':
                if(pair[1] == 'false' || pair[1] == false) {
                    this.visProp['lastArrow'] = false;
                }
                else if(pair[1] == 'true' || pair[1] == true) {
                    this.visProp['lastArrow'] = true;
                }            
                this.setArrow(this.visProp['firstArrow'], this.visProp['lastArrow']);
                break;                   
            case 'curvetype':
                this.curveType = pair[1];
                break;
            case 'fontsize':
                this.visProp['fontSize'] = pair[1];
                break;
            case 'insertticks':
                if(this.type == JXG.OBJECT_TYPE_TICKS) {
                    var old = this.insertTicks;
                    this.insertTicks = true;
                    if(pair[1] == 'false' || pair[1] == false) {
                        this.insertTicks = false;
                    }
                    if(old != this.insertTicks) this.calculateTicksCoordinates();
                }
                break;
            case 'drawlabels':
                if(this.type == JXG.OBJECT_TYPE_TICKS) {
                    var old = this.drawLabels;
                    this.drawLabels = true;
                    if(pair[1] == 'false' || pair[1] == false) {
                        this.drawLabels = false;
                    }
                    if(old != this.drawLabels) this.calculateTicksCoordinates();
                }
                break;
            case 'drawzero':
                if(this.type == JXG.OBJECT_TYPE_TICKS) {
                    var old = this.drawZero;
                    this.drawZero = true;
                    if(pair[1] == 'false' || pair[1] == false) {
                        this.drawZero = false;
                    }
                    if(old != this.drawZero) this.calculateTicksCoordinates();
                }
                break;
            case 'minorticks':
                if(this.type == JXG.OBJECT_TYPE_TICKS) {
                    var old = this.minorTicks;
                    if((pair[1] != null) && (pair[1] > 0))
                        this.minorTicks = pair[1];
                    if(old != this.minorTicks) this.calculateTicksCoordinates();
                }                
                break;
            case 'majortickheight':
                if(this.type == JXG.OBJECT_TYPE_TICKS) {
                    var old = this.majorHeight;
                    if((pair[1] != null) && (pair[1] > 0))
                        this.majorHeight = pair[1];
                    if(old != this.majorHeight) this.calculateTicksCoordinates();
                }                                
                break;
            case 'minortickheight':
                if(this.type == JXG.OBJECT_TYPE_TICKS) {
                    var old = this.minorHeight;
                    if((pair[1] != null) && (pair[1] > 0))
                        this.minorHeight = pair[1];
                    if(old != this.minorHeight) this.calculateTicksCoordinates();
                }                                
                break;
            case 'snapwidth':
                if(this.type == JXG.OBJECT_TYPE_GLIDER) {
                    this.snapWidth = pair[1];
                }
        }
    }
};

/**
 * Set the dash style of an object. See {@link #dash} for a list of available dash styles.
 * You should use {@link #setProperty} instead of this method. 
 * @param {number} dash Indicates the new dash style
 * @private
*/
JXG.GeometryElement.prototype.setDash = function(dash) {
    this.visProp['dash'] = dash;
    this.board.renderer.setDashStyle(this,this.visProp);
};

/**
 * Notify all child elements for updates.
 * @private
 */
JXG.GeometryElement.prototype.prepareUpdate = function() {
    this.needsUpdate = true;
    return; // Im Moment steigen wir nicht rekursiv hinab
    /* End of function  */
    for(var Elements in this.childElements) {
        /* Wurde das Element vielleicht geloescht? */
        if(this.board.objects[Elements] != undefined) {
            /* Nein, wurde es nicht, also updaten */
            this.childElements[Elements].prepareUpdate(); 
        } else { /* es wurde geloescht, also aus dem Array entfernen */
            delete(this.childElements[Elements]);
        }
    }
};

/**
 * Removes the element from the construction.
 */
JXG.GeometryElement.prototype.remove = function() {    
    this.board.renderer.remove(document.getElementById(this.id));
    if (this.hasLabel) {
        this.board.renderer.remove(document.getElementById(this.label.content.id));
    }    
};

/**
 * Returns the coords object where a text that is bound to the element shall be drawn.
 * Differs in some cases from the values that getLabelAnchor returns.
 * @type JXG.Coords
 * @return JXG.Coords Place where the text shall be drawn.
 * @see #getLabelAnchor
 * @private
 */
JXG.GeometryElement.prototype.getTextAnchor = function() {    
    return new JXG.Coords(JXG.COORDS_BY_USER, [0,0], this.board);
};

/**
 * Returns the coords object where the label of the element shall be drawn.
  * Differs in some cases from the values that getTextAnchor returns.
 * @type JXG.Coords
 * @return JXG.Coords Place where the label of an element shall be drawn.
  * @see #getTextAnchor
 * @private
 */
JXG.GeometryElement.prototype.getLabelAnchor = function() {    
    return new JXG.Coords(JXG.COORDS_BY_USER, [0,0], this.board);
};

/**
 * TODO
 * Was hat das hier verloren? Styles gibts doch nur fuer Punkte oder?
 * Sollte das dann nicht nur in Point.js zu finden sein? --michael
 * @private
 */
JXG.GeometryElement.prototype.setStyle = function(x) {    
};

/**
 * TODO
 * Was hat das hier verloren? "Straights" gibts doch nur fuer Lines oder?
 * Sollte das dann nicht nur in Line.js zu finden sein? --michael
 * @private
 */
JXG.GeometryElement.prototype.setStraight = function(x,y) {    
};

/**
 * TODO
 * Dito setStraight. Das gilt doch eh nur fuer lines, also wozu hier reinstellen? --michael
 * @private
 */
JXG.GeometryElement.prototype.setArrow = function(firstArrow,lastArrow) {    
};

/**
 * Creates a label element for this geometry element.
 * Doesn't add the label to the board, so it shouldn't be called itself. Use {@link #addLabelToElement} instead.
 * @param {boolean} withLabel true if a label shall be initialized, false otherwise.
 * @see #addLabelToElement 
 * @private
 */
JXG.GeometryElement.prototype.createLabel = function(withLabel,coords) { 
    if (typeof coords=='undefined' || coords==null) {
        coords = [10,10];
    }
    var isTmpId = false;
    this.nameHTML = this.board.algebra.replaceSup(this.board.algebra.replaceSub(this.name)); 
    this.label = {};
    if (typeof withLabel=='undefined' || withLabel==true) {
        if (this.board.objects[this.id]==null) {
            this.board.objects[this.id] = this;
            isTmpId = true;
        }
        this.label.relativeCoords = coords;
        this.label.content = new JXG.Text(this.board, this.nameHTML, this.id, 
            [this.label.relativeCoords[0]/(this.board.unitX*this.board.zoomX),this.label.relativeCoords[1]/(this.board.unitY*this.board.zoomY)], this.id+"Label", "", null, true);
        if (isTmpId) delete(this.board.objects[this.id]);
        this.label.color = '#000000';
        if(!this.visProp['visible']) {
            this.label.hiddenByParent = true;
            this.label.content.visProp['visible'] = false;
        }
        this.hasLabel = true;
    }
};

/**
 * Adds a label to the element.
 */
JXG.GeometryElement.prototype.addLabelToElement = function() {
    this.createLabel(true);
    this.label.content.id = this.id+"Label";  
    this.board.addText(this.label.content);
    this.board.renderer.drawText(this.label.content);
    if(!this.label.content.visProp['visible']) {
        board.renderer.hide(this.label.content);
    }       
};

/**
 * Highlights the element.
 */
JXG.GeometryElement.prototype.highlight = function() {
    this.board.renderer.highlight(this);
};

/**
 * Uses the "normal" properties of the element.
 */
JXG.GeometryElement.prototype.noHighlight = function() {
    this.board.renderer.noHighlight(this);
};

/**
 * Removes all objects generated by the trace function.
 */
JXG.GeometryElement.prototype.clearTrace = function() {
    for(var obj in this.traces) {
        this.board.renderer.remove(this.traces[obj]);
    }
    this.numTraces = 0;
};

/**
 * Copy element to background. Has to be implemented in the element itself.
 * @private
 */
JXG.GeometryElement.prototype.cloneToBackground = function(addToTrace) {
    return;
};

// [c,b0,b1,a,k]
/**
 * Normalize the element's standard form.
 * @private
 */
JXG.GeometryElement.prototype.normalize = function() {
    this.stdform = this.board.algebra.normalize(this.stdform);
};

/**
 * EXPERIMENTAL. Generate JSON object code of visProp and other properties.
 * @type string
 * @private
 * @return JSON string containing element's properties.
 */
JXG.GeometryElement.prototype.toJSON = function() {
    var json = '{"name":' + this.name;
    json += ', ' + '"id":' + this.id;

    var vis = [];
    for (var key in this.visProp) {
        if (this.visProp[key]!=null) {
            vis.push('"' + key + '":' + this.visProp[key]);
        }
    }
    json += ', "visProp":{'+vis.toString()+'}';
    json +='}';

    return json;
};
