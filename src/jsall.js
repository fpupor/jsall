////////////////////////////////////////////////////////////////////
// JavaScript AutoLoad 0.1
// March, 31, 2009
//
// by Felipe Pupo and Flavio Medeiros

var JsAll = {};

////////////////////////////////////////////////////////////////////

JsAll.Config = 
{
    cmdsId : 0, root : 'js/', srs: {}, loaders : {},
	
	addClasses : function (obj, bFw)
	{
		for (var name in obj)
		{
			this.ensureSr(name, bFw);
			this.srs[name].children = obj[name].req;
			
			if (obj[name].req)
			{
				var arrayChildren = obj[name].req.split(',');
				for (var x = 0; x < arrayChildren.length; x++)
				{
					var childName = arrayChildren[x];
					this.ensureSr(childName, bFw);
				}
			}
			
			if (obj[name].css == true)
			{
				this.srs[name].css = true;
			}
			else if (typeof(obj[name].css) == 'string')
			{
				this.srs[name].css = obj[name].css;
			}
		}
	},
	
	setFramework: function (fwName, objs)
	{
		this.srFw = new JsAll.Obj (fwName);
		this.ensureSr(fwName, true);
		this.addObj(this.srFw);
		this.addClasses(objs, true);
	},	
	
	addObj : function (sr)
	{
		this.ensureSr(sr.name);
		this.srs[sr.name].obj = sr;
	},	
	
	ensureSr : function (srName, bFw)
	{
		if (this.srs[srName])
			return;
			
		this.srs[srName] = {};
		this.srs[srName].fw = false;
				
		if (bFw == true)
			this.srs[srName].fw = true;
	},	

	objExists : function (srName)
	{
		if (this.srs[srName] && this.srs[srName].obj)
		{
			return true;
		}
		return false;
	},
	
	getObj : function (srName)
	{
		if (this.objExists(srName))
			return this.srs[srName].obj;	
	},
	
	getLoader: function (sr)
	{
		if (this.loaders[sr.name]) // Loader already exists
			return this.loaders[sr.name];
	
		loader = new JsAll.Loader(sr);
		loader.load();
		this.loaders[sr.name] = loader;
		
		if (this.srs[sr.name].css) // A LoaderCSS is needed
		{
			loaderCss = new JsAll.LoaderCss(sr);
			loaderCss.load();
		}
		
		sr.status == 'loading';
		return loader;
	},	
	
	getPath : function(srName)
	{
		path = this.root;
		
		if (srName == 'config') // Configuration file (required!) 
		{
			return path + 'config' + '.js';	
		}
		
		if (this.srs[srName].fw) // This class belongs do a framework
		{
			path += this.srFw.name + '/';
			if (this.srFw.name == srName) // It´s the framework itself!
			{
				path += 'core.js';
				return path;
			}				
		}
		path += 'classes/' + srName + '/class.js'; // A regular class (outside a framework)
		return path;
	},
	
	getCssPath : function(srName)
	{
		cssConfig = this.srs[srName].css;
			
		if (!cssConfig) // This class doesn´t have a css file attached
			return false;
			
		if (cssConfig == true) // Default css file was attached
		{
			path = this.root;
			if (this.srs[srName].fw)
			{
				path += this.srFw.name + '/';
			}
			path += 'classes/' + srName + '/style.css';
			return path;
		}
		else // The css file is a custom one
		{
			path = cssConfig;
		}
		return path;
	}	
};

////////////////////////////////////////////////////////////////////

JsAll.Factory =
{
	getInstance : function (name) // Returns a new or stored JsAll.Obj instance (from JsAll.Config)
	{
		if (JsAll.Config.objExists(name)) 
		{
			var sr = JsAll.Config.getObj(name); // Retrieves a previous instance
		}
		else
		{		
			var sr = new JsAll.Obj(name); // Instantiates and stores in config
			JsAll.Config.addObj(sr);
		}
		
		if (JsAll.Config.srs[name] && JsAll.Config.srs[name].children)
		{
			this.addChildren(sr); // Adds children
		}
		
		if (JsAll.Config.srFw && JsAll.Config.srs[sr.name].fw)
		{
			sr.addChild(JsAll.Config.srFw); // Adds framework 
		}
		
		return sr;
	},
	
	addChildren : function (sr)
	{
		var arrayChildren = JsAll.Config.srs[sr.name].children.split(',');
		for (var x = 0; x < arrayChildren.length; x++)
		{
			var childName = arrayChildren[x];
			sr.addChild(this.getInstance(childName));
		}
	}
};

////////////////////////////////////////////////////////////////////

JsAll.Obj = function (name) 
{
	this.status  	= 'new';
	this.name 		= name;
	this.children	= {};
	this.parents	= {};
	this.cmds		= {};
		
	this.load = function()
	{
		if (this.status == 'new')
		{
			this.startLoading();
		}
		return true;
	};
	
	this.startLoading = function ()
	{
		for (var childName in this.children)
		{
			this.children[childName].startLoading();
		}
		this.loader = JsAll.Config.getLoader(this);
	};
	
	this.finishedLoading = function ()
	{
		this.status = 'loaded';
		this.embedScript();
	};
	
	this.embedScript = function (teste)
	{
		if (this.status == 'loaded' && this.areChildrenReady())
		{
			if (this.loader.embed())
			{
				this.status = 'ready';
				this.runCmds();	
			}
		}
		this.embedParentScript();
	};
	
	this.embedParentScript = function ()
	{
		if (!this.parents)
			return;
		
		for (var parentName in this.parents)
		{
			this.parents[parentName].embedScript();
		}
	};
	
	this.isNew = function ()
	{
		if (this.status == 'new')
		{
			return true;
		}
		return false;
	};
	
	this.isReady = function ()
	{
		if (this.status == 'ready')
		{
			return true;
		}
		return false;
	};
	
	this.areChildrenReady = function ()
	{
		for (var childName in this.children)
		{
			if (!this.children[childName].isReady())
			{
				return false;
			}
		}
		return true;
	};
	
	this.addCmd = function (cmd)
	{
		this.cmds[cmd.id] = cmd;
	};
	
	this.addChild = function (child)
	{
		this.children[child.name] = child;
		child.addParent(this); // 'This' is set as child's parent
	};		
	
	this.addParent = function (parent)
	{
		this.parents[parent.name] = parent;
	};
	
	this.runCmds = function ()
	{
		if (!this.cmds)
			return;
			
		for (var cmdId in this.cmds)
		{
			this.cmds[cmdId].run();
		}
	};	
};

////////////////////////////////////////////////////////////////////

JsAll.getXmlHttp = function()
{
	if (window.XMLHttpRequest)
		var xmlHttp = new XMLHttpRequest();
	
	else if(window.ActiveXObject)
		var xmlHttp = ActiveXObject('Microsoft.XMLHTTP');
		
	return xmlHttp;
};

////////////////////////////////////////////////////////////////////

JsAll.Loader = function(sr)
{
	var xmlHttp = JsAll.getXmlHttp();
	var el = null;
	
	this.load = function()
	{
		el 		= document.createElement('script');
		el.id 	= sr.name + '_embed';
		el.name = sr.name;
		el.type = 'text/javascript';
		
		if (xmlHttp != null) // Ajax enabled browsers
		{	
			xmlHttp.onreadystatechange = function()
			{
				if(xmlHttp.readyState == 4 && xmlHttp.status == 200) // Loading process has finished
					sr.finishedLoading();
			};
			
			xmlHttp.open('GET', JsAll.Config.getPath(sr.name), true);
			xmlHttp.send(null);
		}
		else // Browsers without Ajax
		{
			el.onreadystatechange = function () // iE
			{
				if (this.readyState == 'complete')
				{
					sr.finishedLoading();
				}
			};
			
			el.onload = function() // FF, etc
			{
					sr.finishedLoading();
			};
			
			el.src = SrConfig.getPath(sr.name);
			document.getElementsByTagName('head')[0].appendChild(el); // Adds element
		}
	};
	
	this.embed = function()
	{
		if(xmlHttp != null)
		{
			el.text = xmlHttp.responseText;
			document.getElementsByTagName('head')[0].appendChild(el);	
		}
		return true;
	};
	
	this.run = function(cmd)
	{
		cmd.code.apply(cmd.codeBind, cmd.codeArgs);
	};
};

////////////////////////////////////////////////////////////////////

JsAll.LoaderCss = function(sr)
{
	var xmlHttp = JsAll.getXmlHttp();
	var el = null;	
	
	this.load = function()
	{
		if (xmlHttp != null)
		{	
			el 		= document.createElement('style');
			el.rel	= 'stylesheet';
			el.id 	= sr.name + '_embed_css';
			el.name = sr.name;
			el.type = 'text/css';

			xmlHttp.onreadystatechange = function()
			{
				if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
				{
					var obj_style = document.getElementsByTagName('head')[0].appendChild(el);
					obj_style.innerHTML = xmlHttp.responseText;
				}
			};
			
			xmlHttp.open('GET', JsAll.Config.getCssPath(sr.name), true);
			xmlHttp.send(null);
		}
		else
		{
			el 		= document.createElement('link');
			el.rel	= 'stylesheet';
			el.id 	= sr.name + '_embed_css';
			el.name = sr.name;
			el.type = 'text/css';
			el.href = JsAll.Config.getCssPath(sr.name);
			
			document.getElementsByTagName('head')[0].appendChild(el);
		}	
	};
};

////////////////////////////////////////////////////////////////////

JsAll.Cmd = function (srName, code, bind, args, type)
{
	var	firstRun 	= true;
	
	this.id 		= JsAll.Config.cmdsId++;
	this.code		= code;
	this.codeArgs	= args;
	this.codeBind	= bind;
	this.type		= type;
		
	if(JsAll.Config.fwName) // Is a framework attached to the autoload? (TODO: é sempre carregado? 17/03/09)
		JsAll.Factory.getInstance(JsAll.Config.fwName);
	
	this.sr = JsAll.Factory.getInstance(srName);
	this.sr.addCmd(this);
		
	this.run = function()
	{
		if (!firstRun)
			return;
			
		if (this.sr.isNew())
			this.sr.load();
		
		if (this.sr.isReady())
		{
			this.sr.loader.run(this);
			firstRun = false;
		}
	};
};

////////////////////////////////////////////////////////////////////

JsAll.Config.displayStatus = function()
{
	for (var key in this.srs)
	{
		if (this.srs[key].obj)
		{
			console.info(this.srs[key].obj.name + ' is ' + this.srs[key].obj.status);	
		}
	}
};

////////////////////////////////////////////////////////////////////

JsAll.ConfigLoader = JsAll.Factory.getInstance('config');

////////////////////////////////////////////////////////////////////

JsAll.ConfigLoader.finishedLoading = function() 
{
	this.status = 'loaded';
	this.embedScript();
	this.parseScriptRequire();
};

JsAll.ConfigLoader.parseScriptRequire = function()
{
	var sElements = document.getElementsByTagName("script");
	
	for (var x = 0; x < sElements.length; x++)
	{
		var sElement = sElements[x];
		
		sElement.sr = {
			type	 : sElement.getAttribute('type'),
			className: sElement.getAttribute('src'),
			arg	 	 : sElement.getAttribute('for'),
			instance : sElement.getAttribute('id'),
			options	 : sElement.innerHTML
		};
		
		if ((sElement.sr.type == "require/compact" || sElement.sr.type == "require/nocompact"  ) && sElement.sr.className)
		{
			sElement.sr.cmd = new JsAll.Cmd(
				sElement.sr.className,
				function()
				{
					if (this.instance)
					{
						this.arg 	 = (this.arg)	 ? '"' + this.arg 	  + '",' :'';
						this.options = (this.options)? '{' + this.options + '} ' :'null';
						
						window[this.instance] = eval("new " + this.className + "(" + this.arg + this.options + ")");
					}
					else
					{
						this.arg = document.getElementById(this.arg);
						var execute = eval("(function(){" + this.options + "})");
						execute.apply(this.arg || this);
					}
				},
				sElement.sr,
				sElement.sr.args,
				sElement.sr.type
			);
			
			sElement.sr.cmd.run();
		}
	}
};

////////////////////////////////////////////////////////////////////

JsAll.ConfigLoader.load();

////////////////////////////////////////////////////////////////////

window.require = function (name, fn, bind, args)
{
	new JsAll.Cmd(name, fn, bind, args).run();
};

////////////////////////////////////////////////////////////////////

