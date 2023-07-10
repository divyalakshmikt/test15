import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Menu
export interface Menu {
	path?: string;
	title?: string;
	type?: string;
	megaMenu?: boolean;
	image?: string;
	active?: boolean;
	badge?: boolean;
	badgeText?: string;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	constructor() { }

	public screenWidth: any;
	public leftMenuToggle: boolean = false;
	public mainMenuToggle: boolean = false;

	// Windows width
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		{
			// title: 'home', type: 'sub', active: false, children: [

			// 	{ path: '/home/ecommerce', title: 'ecommerce', type: 'link' },


			// ]
			path: '/home/ecommerce', title: 'home', type: 'link'
		},
		{
			path: '/shop/collection/left/sidebar', title: 'shop', type: 'link'
			// title: 'Shop', type: 'sub', active: false, children: [
			// 	{ path: '/shop/collection/left/sidebar', title: 'left-sidebar', type: 'link' },
			// 	{ path: '/shop/collection/right/sidebar', title: 'right-sidebar', type: 'link' },
			// 	{ path: '/shop/collection/no/sidebar', title: 'no-sidebar', type: 'link' },
			// 	{ path: '/shop/collection/infinitescroll', title: 'Infinite Scroll', type: 'link' }
			// ]
		},
		// {
		// 	title: 'Products', type: 'sub', active: false, children: [
		// 		{
		// 			title: 'sidebar', type: 'sub', active: false, children: [
		// 				{ path: '/shop/product/left/sidebar/trim-dress', title: 'left-sidebar', type: 'link' },
		// 				{ path: '/shop/product/right/sidebar/trim-dress', title: 'right-sidebar', type: 'link' },
		// 				{ path: '/shop/product/no/sidebar/trim-dress', title: 'no-sidebar', type: 'link' }
		// 			]
		// 		},
		// 		{ path: '/shop/product/three/column/trim-dress', title: 'three-column', type: 'link' },
		// 		{ path: '/shop/product/four/image/belted-dress', title: 'four-image', type: 'link' },
		// 		{ path: '/shop/product/bundle/trim-dress', title: 'bundle-product', type: 'link' },
		// 		{ path: '/shop/product/image/outside/trim-dress', title: 'image-outside', type: 'link' }
		// 	]
		// },

		{
			title: 'pages', type: 'sub', active: false, children: [
				// {
				// 	title: 'account', type: 'sub', active: false, children: [
				// 		{ path: '/pages/wishlist', title: 'wishlist', type: 'link' },
				// 		{ path: '/pages/cart', title: 'cart', type: 'link' },
				// 		// { path: '/pages/dashboard', title: 'dashboard', type: 'link' },
				// 		{ path: '/pages/login', title: 'login', type: 'link' },
				// 		{ path: '/pages/register', title: 'register', type: 'link' },
				// 		{ path: '/pages/contact', title: 'contact', type: 'link' },
				// 		// { path: '/pages/forget/password', title: 'forget-password', type: 'link' },
				// 		{ path: '/pages/profile', title: 'profile', type: 'link' },
				// 		{ path: '/pages/checkout', title: 'checkout', type: 'link' },
				// 	]
				// },
				{ path: '/pages/wishlist', title: 'wishlist', type: 'link' },
						{ path: '/pages/cart', title: 'cart', type: 'link' },
						// { path: '/pages/dashboard', title: 'dashboard', type: 'link' },
						{ path: '/pages/login', title: 'login', type: 'link' },
						{ path: '/pages/register', title: 'register', type: 'link' },
						{ path: '/pages/contact', title: 'contact', type: 'link' },
						// { path: '/pages/forget/password', title: 'forget-password', type: 'link' },
						{ path: '/pages/profile', title: 'profile', type: 'link' },
						{ path: '/pages/checkout', title: 'checkout', type: 'link' },
				{ path: '/pages/profile', title: 'profile', type: 'link' },
				{ path: '/shop/history', title: 'payment-history', type: 'link' },
				{ path: '/pages/aboutus', title: 'about-us', type: 'link' },
				// { path: '/pages/search', title: 'search', type: 'link' },
				// { path: '/pages/typography', title: 'typography', type: 'link', badge: true, badgeText: 'new' },
				// { path: '/pages/review', title: 'review', type: 'link', badge: true, badgeText: 'new' },
				// { path: '/pages/order/success', title: 'order-success', type: 'link' },
				// {
				// 	title: 'compare', type: 'sub', active: false, children: [
				// 		{ path: '/pages/compare/one', title: 'compare-1', type: 'link' },
				// 		{ path: '/pages/compare/two', title: 'compare-2', type: 'link', badge: true, badgeText: 'new' }
				// 	]
				// },
				// { path: '/pages/collection', title: 'collection', type: 'link' },
				// { path: '/pages/lookbook', title: 'lookbook', type: 'link' },
				// { path: '/pages/404', title: '404', type: 'link' },
				// { path: '/pages/comingsoon', title: 'coming-soon', type: 'link', badge: true, badgeText: 'new' },
				// { path: '/pages/faq', title: 'faq', type: 'link' }
			]
		},

	];

	// LEFTMENUITEMS: Menu[] = [
	// 	{
	// 		title: 'clothing', type: 'sub', megaMenu: true, active: false, children: [
	// 			{
	// 				title: 'mens fashion', type: 'link', active: false, children: [
	// 					{ path: '/home/ecommerce', title: 'sports wear', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'top', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'bottom', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'ethic wear', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'sports wear', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'shirts', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'bottom', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'ethic wear', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'sports wear', type: 'link' }
	// 				]
	// 			},
	// 			{
	// 				title: 'women fashion', type: 'link', active: false, children: [
	// 					{ path: '/home/ecommerce', title: 'dresses', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'skirts', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'westarn wear', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'ethic wear', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'bottom', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'ethic wear', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'sports wear', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'sports wear', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'bottom wear', type: 'link' }
	// 				]
	// 			},
	// 		]
	// 	},
	// 	{
	// 		title: 'bags', type: 'sub', active: false, children: [
	// 			{ path: '/home/ecommerce', title: 'shopper bags', type: 'link' },
	// 			{ path: '/home/ecommerce', title: 'laptop bags', type: 'link' },
	// 			{ path: '/home/ecommerce', title: 'clutches', type: 'link' },
	// 			{
	// 				path: '/home/ecommerce', title: 'purses', type: 'link', active: false, children: [
	// 					{ path: '/home/ecommerce', title: 'purses', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'wallets', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'leathers', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'satchels', type: 'link' }
	// 				]
	// 			},
	// 		]
	// 	},
	// 	{
	// 		title: 'footwear', type: 'sub', active: false, children: [
	// 			{ path: '/home/ecommerce', title: 'sport shoes', type: 'link' },
	// 			{ path: '/home/ecommerce', title: 'formal shoes', type: 'link' },
	// 			{ path: '/home/ecommerce', title: 'casual shoes', type: 'link' }
	// 		]
	// 	},
	// 	{
	// 		path: '/home/ecommerce', title: 'watches', type: 'link'
	// 	},
	// 	{
	// 		title: 'Accessories', type: 'sub', active: false, children: [
	// 			{ path: '/home/ecommerce', title: 'fashion jewellery', type: 'link' },
	// 			{ path: '/home/ecommerce', title: 'caps and hats', type: 'link' },
	// 			{ path: '/home/ecommerce', title: 'precious jewellery', type: 'link' },
	// 			{
	// 				path: '/home/ecommerce', title: 'more..', type: 'link', active: false, children: [
	// 					{ path: '/home/ecommerce', title: 'necklaces', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'earrings', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'rings & wrist wear', type: 'link' },
	// 					{
	// 						path: '/home/ecommerce', title: 'more...', type: 'link', active: false, children: [
	// 							{ path: '/home/ecommerce', title: 'ties', type: 'link' },
	// 							{ path: '/home/ecommerce', title: 'cufflinks', type: 'link' },
	// 							{ path: '/home/ecommerce', title: 'pockets squares', type: 'link' },
	// 							{ path: '/home/ecommerce', title: 'helmets', type: 'link' },
	// 							{ path: '/home/ecommerce', title: 'scarves', type: 'link' },
	// 							{
	// 								path: '/home/ecommerce', title: 'more...', type: 'link', active: false, children: [
	// 									{ path: '/home/ecommerce', title: 'accessory gift sets', type: 'link' },
	// 									{ path: '/home/ecommerce', title: 'travel accessories', type: 'link' },
	// 									{ path: '/home/ecommerce', title: 'phone cases', type: 'link' }
	// 								]
	// 							},
	// 						]
	// 					}
	// 				]
	// 			},
	// 		]
	// 	},
	// 	{
	// 		path: '/home/ecommerce', title: 'house of design', type: 'link'
	// 	},
	// 	{
	// 		title: 'beauty & personal care', type: 'sub', active: false, children: [
	// 			{ path: '/home/ecommerce', title: 'makeup', type: 'link' },
	// 			{ path: '/home/ecommerce', title: 'skincare', type: 'link' },
	// 			{ path: '/home/ecommerce', title: 'premium beaty', type: 'link' },
	// 			{
	// 				path: '/home/ecommerce', title: 'more..', type: 'link', active: false, children: [
	// 					{ path: '/home/ecommerce', title: 'fragrances', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'luxury beauty', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'hair care', type: 'link' },
	// 					{ path: '/home/ecommerce', title: 'tools & brushes', type: 'link' }
	// 				]
	// 			},
	// 		]
	// 	},
	// 	{
	// 		path: '/home/ecommerce', title: 'home & decor', type: 'link'
	// 	},
	// 	{
	// 		path: '/home/ecommerce', title: 'kitchen', type: 'link'
	// 	}
	// ];

	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
	// leftMenuItems = new BehaviorSubject<Menu[]>(this.LEFTMENUITEMS);

}
