/**
 * @author felipe pupo rodrigues
 * @projectDescription embed require javascripts and execute code after.
 * @copyright Quiness.com.br
 * @license free for learning and personal sites
**/

/**
 * Example of instance
 *
 * Embed code in your html
 * <script src="js/initialize.js" type="text/javascript"></script>
 * Cerate a new Instance
 * fwLoad = new document.FrameworkSupport();
 * fwLoad.initialize("framework@version");
 * Use method require for load new scripts
 * fwLoad.require(["myPlugin@pasteNameOfPlugin"]);
**/

/**
 * Example of auto create instance
 *
 * Embed code in your html, this id necessary for automate
 * <script id="FrameworkSupport" src="js/initialize.js" type="text/javascript" for="framework@version"></script>
 * Use method require in document for load new scripts
 * document.Require(["myPlugin@pasteNameOfPlugin"]);
**/

/**
 * Example of require call function
 *
 * Use method require and pass a function for call after load
 * document.Require(["myPlugin@pasteNameOfPlugin"],function(){
 *		my javascript code....
 * });
**/

/**
 * Example of require call function and bind other object
 *
 * Use method require and pass a function for call after load
 * document.Require(["myPlugin@pasteNameOfPlugin"],function(){
 *		my javascript code....
 * },$('myelement'));
**/

/**
 * Example of require in html code
 *
 * Use tag script and type "require" and create your javascript call inside tag
 * <script type="require" src="dwCheckboxes@plugins">
 * 	alert("dwCheckboxes loaded");
 *  $("sex").dwCheckboxes({elements: $$("input[type=checkbox]"),effect:"fade"});
 * </script>
**/

/**
 * Example of create new instance in HTML code
 * even $("sex").dwCheckboxes({elements: $$("input[type=checkbox]"),effect:"fade"});
 *
 * Use tag script and type "require" and create id name for new instance and pass options inside tag
 * <script type="require" src="dwCheckboxes@plugins" id="myCheckboxe">
 * 	elements: $$("input[type=checkbox]"),
 *  effect: "fade"
 * </script>
**/

/**
 * Example of create new instance in HTML code and pass element
 * even myCheckboxe = new dwCheckboxes($("sex"),{options});
 *
 * Use tag script and pass id or html selectors in tag for
 * <script type="require" src="dwCheckboxes@plugins" id="myCheckboxe" for="sex">
 *  options...
 * </script>
**/

/**
 * Example of call method of element
 * even $("sex").dwCheckboxes({effect:"fade"});
 *
 * Use tag script and pass id or html selectors in tag for, no set attribute id
 * <script type="require" src="dwCheckboxes@plugins" for="sex">
 *  effect: "fade"
 * </script>
**/
(function(){
	window.autoLoad = function(){
		this.path = "js/"
		this.lastRequestId = 0;
		
		this.initialize = function(fileVersion)
		{
			if(!this.fileVersion)
				return;
				
			this.createScriptEl(fileVersion,'framework');
			this.createScriptEl(fileVersion,'config');
		}
		
		this.createScriptEl = function(fileVersion, file)
		{
			var fileVersion = fileVersion.split("@");
			var fwName 		= fileVersion[0];
			var fwVersion 	= fileVersion[1];
			
			this.path += fwName + "/" + fwVersion + "/";
			
			var scriptEl 	= document.createElement('script');
			scriptEl.id 	= file + '_' + fwName + "@" + fwVersion;
			scriptEl.name 	= fwName;
			scriptEl.type 	= "text/javascript";
			scriptEl.src 	= this.path + file + '.js';
			
			document.getElementsByTagName('body')[0].appendChild(scriptEl);
		}
		
		this.require = function(name, command, bind)
		{
			var classConfig = this.config.classes.(name);
				
			if(classConfig.isAvailable)
				return true;
			
			var classRequire = classConfig.require;
			
			for(var at = 0; at < classRequire.length; at++)
			{
				var currentRequire = this.config.classes.(classRequire[at]);
				if(!currentRequire.isAvailable)
				{
					this.require(classRequire[at], command, bind);
				}
			}
			
			if(classConfig.isLoading)
			{
				this.embedScript(name+"@plugins",requestId);	
			};
			
			var requestId = this.lastRequestId++;
			this.requests.[requestId] = {
				"name":name,
				"complete":classRequire.length,
				"command":command,
				"bind":bind
			}
				
			this.embedScript(name+"@plugins",requestId);
			//var isComplete = this.checkComplete();
			
			
			if (recusaoestanoprimenivel AND isComplete))
			{
				this.executeTag();
			}
			
			
			
			// magica de incluir
			
			// setar isAvailable
			
			
			
			
			
			
			/*var nrequireid = this.nrequireid ++;
			this.nrequire[nrequireid] = {
				"files":files,
				"complete":files.length,
				"command":command,
				"bind":bind,
				"recall":true
			}
			for(var at = 0; at < files.length; at++)
			{
				if(!this.embed[files[at]])
				{
					this.embedScript(files[at],nrequireid);
				}
				else if(this.embed[files[at]] && this.embed[files[at]].status == "loading")
				{
					this.embed[files[at]].forCompleteExec.push(nrequireid);
				}
				else
				{
					this.checkComplete(nrequireid,files[at]);
				}
			}*/
		}
		
		this.parserTag = function()
		{
			var tagparser = document.getElementsByTagName(this.tag);
			for(var c=0;c < tagparser.length;c= c+1){
				//console.info(tagparser[c]);
				if(tagparser[c].getAttribute(this.filter.attribute) == this.filter.value)
				{
					//alert("nao");
					this.require([tagparser[c].getAttribute('src')],this.executeTag,tagparser[c]);
				}
				else if(tagparser[c].getAttribute(this.filter.attribute) == this.filter.compact)
				{
					console.info("COMPACT this "+c);
				}
			}
		}
		
		this.embedScript = function(file,nrequireid)
		{
			this.embed[file] = {};
			this.embed[file].status = "loading";
			this.embed[file].forCompleteExec = Array();
			this.embed[file].forCompleteExec.push(nrequireid);
			
			var file = file.split('@');
			var file_name = file[0];
			var file_type = file[1];
			
			var newEmbedScript = document.createElement('script');
			newEmbedScript.id = file_name+"@"+file_type;
			newEmbedScript.name = file_name;
			newEmbedScript.type = "text/javascript";
			newEmbedScript.parentRequireClass = this;
			
			newEmbedScript.onreadystatechange = function () {
				if (this.readyState == "complete")
					this.parentRequireClass.embedComplete(this,nrequireid);
			}
			newEmbedScript.onload = function(){
				this.parentRequireClass.embedComplete(this,nrequireid);
			}
			
			if(file_type == "extras")
				newEmbedScript.src = this.path+file_type+this.ds+file_name+".js";
			else
				newEmbedScript.src = this.path+file_type+this.ds+file_name+this.ds+this.file;
				
			document.getElementsByTagName('body')[0].appendChild(newEmbedScript);
			
		}
		
		this.embedComplete = function(embed,nrequireid)
		{
			this.embed[embed.id].status = "complete";
			this.embed[embed.id].object = embed;
			for(var x = 0; x<this.embed[embed.id].forCompleteExec.length; x++){
				this.checkComplete(this.embed[embed.id].forCompleteExec[x],embed.id);	
			}
		}
		
		this.checkComplete = function(id,klass)
		{
			this.requests[id].complete --;
			if(this.requests[id].complete <= 0){
				/*klass = (klass)?klass.split("@"):null;
				var klass_name = (klass)?klass[0]:null;
				var klass_type = (klass)?klass[1]:null;
				if(window[klass_name] || this.nrequire[id].ignore || klass_type == "extras"){
					if(this.nrequire[id].bind)
					{
						this.nrequire[id].command.apply(this.nrequire[id].bind);
					}
					else
					{
						this.nrequire[id].command();
					}
				}else if(this.nrequire[id].recall){
					this.nrequire[id].recall = false;
					var bind = this;
					var args = [id,klass_name];
					var fn = function(id,klass_name){
						this.checkComplete(id,klass_name);
					}
					var returns = function(){
						return fn.apply(bind, args);
					};
					setTimeout(returns,10);
				}else
					this.nrequire[id].ignore = true;
				*/
			}
		}
		
		this.executeTag = function(){
			//alert(typeof(this.id));
			var klass = this.getAttribute('id')
			klass = (klass)?klass.split("@"):null;
			klass = (klass)?klass[0]:null;
			var item = (this.getAttribute('htmlFor'))?this.getAttribute('htmlFor'):((this.getAttribute('for'))?this.getAttribute('for'):null);
			var item = (item)?"'"+item+"'":"";
			var options = this.innerHTML;
			var options = (options != "")?options:"";
			if(klass)
			{
				item = (item!="")?item+",":"";
				window[klass] = eval("new "+this.klass+"("+item+"{"+options+"})");
				
			}
			else if(item!="")
			{
				eval("$("+item+")."+this.klass+"({"+options+"})");
			}
			else if(options!="")
			{
				eval(options);
			}
		}
	}

	//auto load framework
	var initFramework = document.getElementById("initFramework");
	if(initFramework)
	{
		var fwName = false;
		
		if(initFramework.getAttribute('htmlFor'))
		{
			fwName = initFramework.getAttribute('htmlFor');
		}
		else
		{
			fwName = initFramework.getAttribute('for')
		}

		if(fwUse)
		{
			document.init = new window.autoLoad();
			document.init.initialize(fwName);

			document.Require = function(file,command,bind)
			{
				document.init.require(file,command,bind);
			}
		}
	}
})();