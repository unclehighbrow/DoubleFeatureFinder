'use strict';

// REACT
var { StyleSheet } = require('react-native');
var swatches = require('./swatches');


// METRICS
var SPACING = 16;


// RULES 
var foundation = StyleSheet.create({
		
	// STRUCTURE
	container: {
	    flex: 1,
	    left: 0, // https://github.com/facebook/react-native/issues/1332
	    backgroundColor: 'white'
	},

	stripe: {
		flex: 1,
   		justifyContent: 'flex-start',
		backgroundColor: swatches.contentBG,
		borderTopColor: swatches.border,
		borderTopWidth: 1
	},

	stripeCollection: {
		backgroundColor: swatches.collectionBGLight
	},

	stripeInverted: {
		backgroundColor: swatches.contentBGInverted,
		borderTopColor: swatches.borderInverted,
	},

	stripeFirstChild: {
		borderTopWidth: 0
	},

	bounds: {
		paddingTop: SPACING * 1.5,
		paddingHorizontal: SPACING,
		paddingBottom: SPACING * 0.5,
		flex: 1
	},

	list:{
		//reconsider ios style
		marginRight: -1*SPACING,
		flex: 1
	},

	listItem: {
		paddingTop: SPACING,
		paddingRight: SPACING,
		//paddingLeft: SPACING,
		flex: 1,
		borderTopColor: swatches.border,
		borderTopWidth: 1
	},

	card: {
		backgroundColor: 'white',
		borderRadius: 5,
		borderColor: swatches.border,
		borderWidth: 1,
		overflow: 'hidden'
		/*
		shadowColor: 'rgba(0,0,0,.2)',
		shadowOffset: {width: 0, height: 0},
		shadowOpacity: 1,
		shadowRadius: 2,
		*/
	},

	cardOnInverted: {
		borderColor: '#000',
	},

	chunk: {
		paddingBottom: SPACING,
	},

	pseudoLine: {
		marginTop: 4,
		marginBottom: 4
	},

	row: {
		flex: 1,
		flexDirection: 'row'
	},

	rowItemShrink:{
		flex: 0,
	},

	rowItemGrow:{
		flex: 1,
	},

	bordered:{
		paddingTop: SPACING,
		borderTopWidth: 1,
		borderColor: swatches.border
	},

	tableCell: {
		borderTopWidth: 1, 
		borderColor: swatches.border, 
		marginLeft: 16
	},

	// TYPOGRAPHY

	text: {
		color: swatches.textPrimary,
		fontSize: 16,
		lineHeight: 16*1.25,
		fontWeight: "400",
	},

	textHeadline: {
		fontSize: 20,
		lineHeight: 20*1.2,
		fontWeight: "600"
	},

	textHeader: {
		fontSize: 13,
		lineHeight: 16,
		fontWeight: "600"
	},

	textDisplay: {
		fontSize: 28,
		lineHeight: 28*1.2,
	},

	textBold: {
		fontWeight: "500"
	},

	textHeavy: {
		fontWeight: "600"
	},

	textSmall: {
		fontSize: 14,
		lineHeight: 14*1.3
	},

	textTiny: {
		fontSize: 13, 
		lineHeight: 13 * 1.3
	},

	textPrimary: {
		color: swatches.textPrimary
	},

	textSecondary: {
		color: swatches.textSecondary
	},

	textHint: {
		color: swatches.textTertiary
	},

	textPrimaryInverted: {
		color: swatches.textPrimaryInverted
	},

	textSecondaryInverted: {
		color: swatches.textSecondaryInverted
	},

	textHintInverted: {
		color: swatches.textTertiaryInverted
	},

	textShadow: {
	    shadowColor: 'black',
	    shadowOffset: {width: 1, height: 1},
	    shadowOpacity: .7,
	    shadowRadius: 2
	},

	// MODIFIERS

	alignItemsCenter: {
		alignItems: 'center'
	},

	textAlignCenter: {
		textAlign: 'center'
	},

	textAlignRight: {
		textAlign: 'right'
	},


	// MISC UI

	button: {
		//borderRadius: 26,
		borderRadius: 4,
		padding: SPACING,
		borderWidth: 1,
		borderColor: 'transparent'
	},

	buttonSmall: {
		//borderRadius: (7 + SPACING/2 + 2),
		padding: SPACING/2,
		borderWidth: 1,
		borderColor: 'transparent'
	},


	// OUTLINE
	buttonOutline: {
		backgroundColor:'transparent', 
		//borderColor: swatches.border,
		borderColor: swatches.borderDark
	},

	buttonOutlineInverted: {
		backgroundColor:'transparent', 
		borderColor: swatches.borderInverted
	},

	buttonOutlineContrast: {
		backgroundColor:'transparent', 
		borderColor: swatches.white
	},

	// PRIMARY 
	buttonPrimary: {
		backgroundColor: swatches.tintBG,
	},

	buttonPrimaryInverted: {
		backgroundColor: swatches.tintBG,		
	},

	buttonPrimaryContrast: {
		backgroundColor: swatches.white,		
	},

	// SECONDARY (doesn't work)
	buttonSecondary: {
		backgroundColor: swatches.collectionBGDark,
	},

	buttonText: {
		color: 'white',
		fontSize: 16,
		backgroundColor: 'rgba(0,0,0,0)',
		textAlign: 'center'
	},

	link: {
		color: swatches.link,
	},

	avatarTiny: {
		borderRadius: 14,
		height: 28, 
		width: 28,
		//overflow: 'hidden'
	},
	avatarSmall: {
		borderRadius: 16,
		height: 32, 
		width: 32,
		//overflow: 'hidden'
	},
	avatarMedium: {
		borderRadius: 32,
		height: 64, 
		width: 64,
		//overflow: 'hidden'
	},
	avatarLarge: {
		borderRadius: 120,
		height: 240, 
		width: 240,
		//overflow: 'hidden'
	},

	imageBackdrop: {
	    flex: 1,
	    backgroundColor: 'rgba(0,0,0,.35)',
	    padding: SPACING,
	    justifyContent: 'center'
  	},

  	imageBackdropTransparent: {
	    flex: 1,
	    padding: SPACING,
	    justifyContent: 'center'
  	},

	navigator: {
		backgroundColor: swatches.red,
		color: swatches.white
	}
});

module.exports = foundation;


/*

FUN REACT NOTES

if you ever need to compensate position for scaling
scale = .9
offset = ((screenh * (1/scale)) - screenh)/2

*/