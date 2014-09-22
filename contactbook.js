///////////////////////////////////////><///////////////////////////////////////
//                                Joakim Hagen                                //
///////////////////////////////////////><///////////////////////////////////////

// globals
contacts = [];
nameformat = "%t. %ln, %fn";

function Contact( t, fn, mn, ln, mail, tlf ) {
	this.title = t;
	this.firstname = fn;
	this.middlename = mn;
	this.lastname = ln;
	this.editing = false;
	this.element = $( '#templates > .contactbar' ).clone( true ); // copy element and event handlers
	this.element.find('.nameplate').text( this.formatname( this, nameformat ));
	$( '.contactlist' ).append( this.element );
	contacts.push( this );
}

Contact.prototype.formatname = function( that, fstring ) {
	return fstring.replace(/%(t|fn|mn|ln|M)/g, function( match ) {
		switch( match ) {
			case "%t":  return that.title
			case "%fn": return that.firstname
			case "%mn": return that.middlename ? that.middlename : ""
			case "%ln": return that.lastname
			case "%M":  return that.middlename ? that.middlename[0] +"." : ""
		};
	});
}

function updateallnames( f1, f2 ) {
	var cases1 = [ "%t. %ln", "%fn %mn", "%fn %M", "%fn" ];
	var cases2 = [ " %ln", "", ", %fn %mn", ", %fn %M", ", %fn" ];
	for (var i = 0; i < contacts.length; i++){
		contacts[i].element.find('.nameplate').text(
			contacts[i].formatname( contacts[i], cases1[f1] + cases2[f2] )
		);
	}
}

function getcontact( dom ) {
	alert( dom.html() );
	for (var i = 0; i < contacts.length; i++) {
		alert( contacts[i].element.html() +"\n\n"+ dom.html() );
		if ( contacts[i].element == dom ) {
			alert( "found contact! "+ contacts[i].firstname );
			return contacts[i];
		}
	}
}

function sortby( val ) {
	if ( !contacts || !contacts[0].hasOwnProperty( val ) ) { return; }
	contacts.sort( function( a, b ) {
		return a[val].localeCompare( b[val] );
	});
	list = $( '.contactlist' );
	for (var i = 0; i < contacts.length; i++) {
		list.append( contacts[i].element.get() );
	}
}

function drag( ev ) {
	ev.dataTransfer.setData( "text/html", ev.target.id );
}

function dragover( ev ) {
	ev.preventDefault();
}

function drop( ev ) {
    var data = ev.dataTransfer.getData( "text/html" );
	alert( "delete" );
}

function entername( event ) {
	nameplate = $( event.target );
	nameplate.keydown( function( event ) {
		if ( event.keyCode == 13 ) {
			event.preventDefault();
			$( event.target ).blur();
		}
	});
	nameplate.css( 'min-width', '0.6em' )
		.css( 'margin-right', '0.4em' );
}

function submitname( event ) {
	nameplate = $( event.target );
	nameplate.unbind( 'keydown' );
	if ( nameplate.text().length == 0 ) {
		if ( nameplate.hasClass( 'middle' )) {
			nameplate.css( 'min-width', '0em' )
				.css( 'margin-right', '0em' );
		} else {
			alert( "This field is obligatory." );
			//TODO: when making a new contact, a cancel button aborts and removes it.
			nameplate.focus();
		}
	} else {
		//TODO: check for special characters
		nameplate.css( 'margin-right', '0.4em' );
	}
}



function initialize() {

	$( '.name' ).focusin( entername )
		.focusout( submitname );

	$( '#nameformat1' ).change( function( event ) {
		var f1 = $(event.target);
		var f2 = $( '#nameformat2' );
		if ( f1.val() == 0 ) {
			f2.children('.n2').hide();
			f2.children('.n1').show();
			if ( f2.val() == 0 ) f2.val( 2 );
		} else {
			f2.children('.n1').hide();
			f2.children('.n2').show();
			if ( f2.val() > 1 ) f2.val( 0 );
		}
		updateallnames( f1.val(), f2.val() );
	});

	$( '#nameformat2' ).change( function( event ) {
		updateallnames( $('#nameformat1').val(), $(event.target).val() );
	});

	$( '#sortbox' ).change( function( event ) {
		sortby( $(event.target).val() );
	});

	$( '.editc' ).click( function( event ) {
		alert("edit "+ $(event.target).parent().parent().find('.nameplate').text() );
		var c = getcontact( $(event.target).parent().parent().parent()
			.find('.contactbar') );
		if ( c.editing ) { // toggle name editing off
			c.element.children( '.contactbrief > .nameplate' ).show()
			c.editing = false;
		} else { // toggle name editing on
			var n = $( '#templates > span.name' ); // template
			c.element.children( '.contactbrief > .nameplate' ).hide().after(
				n.clone( true ).addClass( "title" ),
				n.clone( true ).addClass( "first" ),
				n.clone( true ).addClass( "middle" ),
				n.clone( true ).addClass( "last" )
			);
			c.editing = true;
		}
	});

	$( ".uniq" ).click( function(){
		if ( $(this).is(":focus")) {alert("click!");}
	});

	new Contact( "Mr", "Joakim", "", "Hagen", "jokke@hotmale.com", "11122333" );
	new Contact( "Dr", "Knut", "Ove", "Garvik", "kog@gmail.com", "51667788" );
	new Contact( "Ms", "Beate", "", "Tonstad", "bton@gmail.com", "+4790080700" );
}

window.onload = initialize;