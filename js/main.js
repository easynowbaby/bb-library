(function(){  

  window.App = {
  	Models: {},  	
  	Views: {},
  	Collections: {}
  };

  window.template = function(id) {
		return _.template( $('#' + id).html() );
	};

	/******************
	*******************
	*
	* MODELS
	*
	*******************
	*******************/

	App.Models.Contact = Backbone.Model.extend({
		defaults: {
			name: '',			
			address: '',
			email: '',
			tel: ''
		}
	});

	/******************
	*******************
	*
	* COLLECTIONS
	*
	*******************
	*******************/

	App.Collections.Contacts = Backbone.Firebase.Collection.extend({
		url: 'https://myfirsttodo.firebaseio.com/contacts',
		model: App.Models.Contact,		
	});

	/******************
	*******************
	*
	* VIEWS
	*
	*******************
	*******************/

	App.Views.Contacts = Backbone.View.extend({

		el: $('#app'),

		initialize: function() {
			this.list = this.$("#contacts");			
			this.collection.on('sync', this.render, this);
			this.collection.on('sync', _.once(this.setListeners), this);					
		},		

		setListeners: function() {
			this.collection.on('add', this.renderContact, this);
			this.collection.on('remove', this.render, this);
		},		

		render: function() {			
			this.list.empty();					 		
			this.collection.each(this.renderContact, this);			 		
  		return this;
		},

		renderContact: function(contact) {
			window.contactView = new App.Views.Contact({
        model: contact
      });     
      this.list.append(contactView.render().el);
      // init autosizing of textareas
			autosize($('textarea'));
			// set modal trigger
			$('.modal-trigger').leanModal();		
		},

		events: {
			'click #add': 'addContact',
			'click .modal-trigger': 'saveDeleteId',
			'click .delete-modal' : 'deleteContact'					
		},

		addContact: function(e) {
			e.preventDefault();
			var formData = {};

	    $( '#add-contact div' ).children( 'input, textarea' ).each( function( i, el ) {
	        if( $( el ).val() != '' )
	        {
	            formData[ el.id ] = $( el ).val();
	        }
	    });    

	    this.collection.create( formData );

		},	

		saveDeleteId: function(e) {
			this.deleteId = e.target.parentElement.previousSibling.previousSibling.innerHTML;			
		},

		deleteContact: function() {
			var m = this.collection.where({id: this.deleteId});
			this.collection.remove(m);			
		},



	});

	App.Views.Contact = Backbone.View.extend({

		tagName: 'ul',

		className: 'contact card white',

		template: template('contact-template'),		

		render: function() {		  	
			var template =  this.template( this.model.toJSON() );
			this.$el.html( template );					
			return this;
		},

		events: {
			'click .save': 'edit',
			'keypress input, textarea': 'updateOnEnter',			
		},

		updateOnEnter: function(e) {
			if (e.which === 13 && e.target.localName !== 'textarea') {
			console.log('good');						
				this.edit();
			}
		},

		edit: function() {
			var self = this;
			var li = this.$("li");
		  li.each(function(i) {
				var value = $(this).find('[type="text"]').val();						
				var trimmedValue = value.trim();				
				var key = $(this).data('key');								
				if (trimmedValue) {
					self.model.set( key, trimmedValue );					
				}				
			});	
			Materialize.toast('Saved!', 2000);		
		},			

	});

	/******************
	*******************
	*
	* INIT
	*
	*******************
	*******************/

	window.contactsCollection = new App.Collections.Contacts;

	window.contactsView = new App.Views.Contacts({
		collection: contactsCollection
	});


})();

$(document).ready(function(){
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal-trigger').leanModal();
});


