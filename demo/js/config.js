JsAll.Config.setFramework('Mootools',
{
	//native
		'Event' : {req: 'Browser,Array,Function,Number,String,Hash' },
	//class
		'Class' : {req: 'Array,Function,Number,String,Hash' },
		'Class.Extras' : {req: 'Class' },
	//element
		'Element' : {req: 'Browser,Array,Function,Number,String,Hash' },
		'Element.Event' : {req: 'Element,Event' },
		'Element.Style' : {req: 'Element' },
		'Element.Dimensions' : {req: 'Element' },
	//utilities
		'Selectors' : {req: 'Element' },
		'DomReady' : {req: 'Element.Event' },
		'JSON' : {req: 'Array,Function,Number,String,Hash' },
		'Cookie' : {req: 'Browser,Class.Extras' },
		'Swiff' : {req: 'Class.Extras' },
	//fx
		'Fx' : {req: 'Class.Extras' },
		'Fx.CSS' : {req: 'Element.Style,Fx' },
		'Fx.Tween' : {req: 'Fx.CSS' },
		'Fx.Morph' : {req: 'Fx.CSS' },
		'Fx.Transitions' : {req: 'Fx' },
	//request
		'Request' : {req: 'Class.Extras,Element' },
		'Request.HTML' : {req: 'Request' },
		'Request.JSON' : {req: 'JSON,Request' }
});

////////////////////////////////////////////////////////////////////

JsAll.Config.addClasses(
{
	'Drag' : { req: 'Class.Extras,Element.Event,Element.Style,Element.Dimensions,Selectors'},
	'Drag.Move' : { req: 'Drag', css: '/jsall/demo/css/drag.css'}
	//DomReady,Drag,Event,Class,Element.Event,Element.Style,Element.Dimensions,Fx,Fx.Tween,Fx.Morph,Fx.CSS,Fx.Transitions,Selectors
	/*
	'A' : { req: 'B', css: true},
	'B' : { req: 'Fx', css: "/sr/css/test.css"}*/
});