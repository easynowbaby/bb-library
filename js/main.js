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
		//autoSync: false // this is true by default
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
			this.collection.on('sync', this.setListeners, this);
			this.collection.on('change', this.change, this);		
		},

		change: function() {
			console.log('change')
		},

		setListeners: function() {
			this.collection.on('add', this.renderContact, this);
			this.collection.on('remove', this.render, this);
		},		

		render: function() {			
			this.list.empty();					 		
			this.collection.each(this.renderContact, this);
			autosize($('textarea')); 		
  		return this;
		},

		renderContact: function(contact) {
			var contactView = new App.Views.Contact({
        model: contact
      });     
      this.list.append(contactView.render().el);
		},

		events: {
			'click #add': 'addContact',
			'click .delete': 'deleteContact',
		},

		addContact: function(e) {
			e.preventDefault();
			var formData = {};

	    $( '#add-contact div' ).children( 'input' ).each( function( i, el ) {
	        if( $( el ).val() != '' )
	        {
	            formData[ el.id ] = $( el ).val();
	        }
	    });

	    this.collection.create( formData );

		},

		deleteContact: function(e) {
  		var contactId = $(e.target).siblings('#id').html();
  		this.collection.remove(this.collection.where({id: contactId}));
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
			//'keypress li': 'updateOnEnter',
		},

		updateOnEnter: function(e) {
			if (e.which === 13) {
				var value = $(e.target).val();			
				var trimmedValue = value.trim();
				var key = $(e.target).parent('li').attr('class');				
				this.edit(key, value);
			}
		},

		edit: function() {

			var self = this;

			var li = this.$("li");
			  li.each(function(i) {
				var value = $(this).find('[type="text"]').val();						
				var trimmedValue = value.trim();				
				var key = $(this).data('key');
				console.log(trimmedValue);
				console.log(key);				
				if (trimmedValue) {
					self.model.set( key, trimmedValue );	
				}				
			});			
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

$( document ).ready(function() {
    
});


