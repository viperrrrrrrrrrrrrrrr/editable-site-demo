import type { Collection, TinaField } from 'tinacms';

/** Reusable image + alt text pair so editors can never upload an image without alt text. */
const imageField = (name: string, label: string, description?: string): TinaField => ({
	type: 'object',
	name,
	label,
	description,
	fields: [
		{ type: 'image', name: 'src', label: 'Photo', description: 'Upload a new photo or pick one from the media library.' },
		{
			type: 'string',
			name: 'alt',
			label: 'Photo description (for screen readers & Google)',
			description: 'Describe what the photo shows in one short sentence.',
		},
	],
});

const linkField = (name: string, label: string): TinaField => ({
	type: 'object',
	name,
	label,
	fields: [
		{ type: 'string', name: 'label', label: 'Button text' },
		{ type: 'string', name: 'href', label: 'Link (e.g. #menu or https://…)' },
	],
});

const textarea = (name: string, label: string, description?: string): TinaField => ({
	type: 'string',
	name,
	label,
	description,
	ui: { component: 'textarea' },
});

/**
 * A single-document collection: the whole one-page café site.
 * Editors cannot create or delete it, only edit its sections.
 */
export const LandingCollection: Collection = {
	name: 'landing',
	label: 'Home page',
	path: 'src/content/landing',
	format: 'json',
	ui: {
		allowedActions: { create: false, delete: false },
		router: () => '/',
	},
	fields: [
		{
			type: 'object',
			name: 'seo',
			label: 'Google & social preview',
			fields: [
				{ type: 'string', name: 'title', label: 'Page title (browser tab & Google)', required: true },
				textarea('description', 'Short description for Google (~150 characters)'),
				{ type: 'image', name: 'ogImage', label: 'Social share image (1200×630)' },
				{ type: 'string', name: 'ogImageAlt', label: 'Social share image description' },
			],
		},
		{
			type: 'object',
			name: 'brand',
			label: 'Business name & logo',
			fields: [
				{ type: 'string', name: 'name', label: 'Business name', required: true },
				{ type: 'image', name: 'logo', label: 'Logo' },
			],
		},
		{
			type: 'object',
			name: 'nav',
			label: 'Menu links (top of page)',
			list: true,
			ui: { itemProps: (item: { label?: string }) => ({ label: item?.label ?? 'Link' }) },
			fields: [
				{ type: 'string', name: 'label', label: 'Text' },
				{ type: 'string', name: 'href', label: 'Section link (e.g. #menu)' },
			],
		},
		{
			type: 'object',
			name: 'hero',
			label: '1 · Top banner',
			fields: [
				{ type: 'string', name: 'eyebrow', label: 'Small text above the headline' },
				{ type: 'string', name: 'headline', label: 'Headline', required: true },
				textarea('subheadline', 'Text under the headline'),
				linkField('primaryCta', 'Main button'),
				linkField('secondaryCta', 'Second button'),
				imageField('image', 'Main photo'),
			],
		},
		{
			type: 'object',
			name: 'menu',
			label: '2 · Menu & prices',
			fields: [
				{ type: 'string', name: 'kicker', label: 'Small label' },
				{ type: 'string', name: 'heading', label: 'Heading' },
				textarea('intro', 'Intro text'),
				{
					type: 'object',
					name: 'groups',
					label: 'Menu categories',
					list: true,
					ui: { itemProps: (item: { title?: string }) => ({ label: item?.title ?? 'Category' }) },
					fields: [
						{ type: 'string', name: 'title', label: 'Category name (e.g. Coffee)' },
						{
							type: 'object',
							name: 'items',
							label: 'Dishes & drinks',
							list: true,
							ui: { itemProps: (item: { name?: string; price?: string }) => ({ label: `${item?.name ?? 'Item'} — ${item?.price ?? ''}` }) },
							fields: [
								{ type: 'string', name: 'name', label: 'Name' },
								{ type: 'string', name: 'price', label: 'Price (e.g. $4.20)' },
								{ type: 'string', name: 'description', label: 'Short description' },
								{ type: 'string', name: 'tag', label: 'Label (optional, e.g. New, Vegan)' },
							],
						},
					],
				},
				{ type: 'string', name: 'note', label: 'Note under the menu (allergens, prices, etc.)' },
			],
		},
		{
			type: 'object',
			name: 'highlights',
			label: '3 · Highlights with photos',
			fields: [
				{ type: 'string', name: 'kicker', label: 'Small label' },
				{ type: 'string', name: 'heading', label: 'Heading' },
				textarea('intro', 'Intro text'),
				{
					type: 'object',
					name: 'items',
					label: 'Cards',
					list: true,
					ui: { itemProps: (item: { title?: string }) => ({ label: item?.title ?? 'Card' }) },
					fields: [
						{ type: 'string', name: 'title', label: 'Title' },
						textarea('description', 'Description'),
						imageField('image', 'Photo'),
					],
				},
			],
		},
		{
			type: 'object',
			name: 'about',
			label: '4 · About us',
			fields: [
				{ type: 'string', name: 'kicker', label: 'Small label' },
				{ type: 'string', name: 'heading', label: 'Heading' },
				textarea('body', 'Text', 'Leave an empty line between paragraphs.'),
				imageField('image', 'Photo'),
			],
		},
		{
			type: 'object',
			name: 'visit',
			label: '5 · Opening hours & location',
			fields: [
				{ type: 'string', name: 'heading', label: 'Heading' },
				textarea('intro', 'Intro text'),
				{
					type: 'object',
					name: 'hours',
					label: 'Opening hours',
					list: true,
					ui: { itemProps: (item: { days?: string; time?: string }) => ({ label: `${item?.days ?? ''} ${item?.time ?? ''}` }) },
					fields: [
						{ type: 'string', name: 'days', label: 'Days (e.g. Mon – Fri)' },
						{ type: 'string', name: 'time', label: 'Hours (e.g. 7:00 – 18:00)' },
					],
				},
				textarea('address', 'Address'),
				{ type: 'string', name: 'note', label: 'Small note (e.g. holidays, parking)' },
			],
		},
		{
			type: 'object',
			name: 'contact',
			label: '6 · Contact form',
			fields: [
				{ type: 'string', name: 'heading', label: 'Heading' },
				textarea('intro', 'Intro text'),
				{ type: 'string', name: 'submitLabel', label: 'Send button text' },
				textarea('successMessage', 'Message shown after sending'),
			],
		},
		{
			type: 'object',
			name: 'footer',
			label: '7 · Footer',
			fields: [
				textarea('tagline', 'Short text'),
				{ type: 'string', name: 'email', label: 'Public email' },
				{
					type: 'object',
					name: 'social',
					label: 'Social links',
					list: true,
					ui: { itemProps: (item: { label?: string }) => ({ label: item?.label ?? 'Link' }) },
					fields: [
						{ type: 'string', name: 'label', label: 'Name (e.g. Instagram)' },
						{ type: 'string', name: 'href', label: 'URL' },
					],
				},
				{ type: 'string', name: 'legal', label: 'Copyright line' },
			],
		},
	],
};
