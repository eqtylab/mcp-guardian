Navigation Menu
A collection of links for navigating websites.

import \* as React from "react";
import { NavigationMenu } from "radix-ui";
import classNames from "classnames";
import { CaretDownIcon } from "@radix-ui/react-icons";
import "./styles.css";

const NavigationMenuDemo = () => {
return (
<NavigationMenu.Root className="NavigationMenuRoot">
<NavigationMenu.List className="NavigationMenuList">
<NavigationMenu.Item>
<NavigationMenu.Trigger className="NavigationMenuTrigger">
Learn <CaretDownIcon className="CaretDown" aria-hidden />
</NavigationMenu.Trigger>
<NavigationMenu.Content className="NavigationMenuContent">
<ul className="List one">
<li style={{ gridRow: "span 3" }}>
<NavigationMenu.Link asChild>
<a className="Callout" href="/">
<svg
											aria-hidden
											width="38"
											height="38"
											viewBox="0 0 25 25"
											fill="white"
										>
<path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z"></path>
<path d="M12 0H4V8H12V0Z"></path>
<path d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z"></path>
</svg>
<div className="CalloutHeading">Radix Primitives</div>
<p className="CalloutText">
Unstyled, accessible components for React.
</p>
</a>
</NavigationMenu.Link>
</li>

    						<ListItem href="https://stitches.dev/" title="Stitches">
    							CSS-in-JS with best-in-class developer experience.
    						</ListItem>
    						<ListItem href="/colors" title="Colors">
    							Beautiful, thought-out palettes with auto dark mode.
    						</ListItem>
    						<ListItem href="https://icons.radix-ui.com/" title="Icons">
    							A crisp set of 15x15 icons, balanced and consistent.
    						</ListItem>
    					</ul>
    				</NavigationMenu.Content>
    			</NavigationMenu.Item>

    			<NavigationMenu.Item>
    				<NavigationMenu.Trigger className="NavigationMenuTrigger">
    					Overview <CaretDownIcon className="CaretDown" aria-hidden />
    				</NavigationMenu.Trigger>
    				<NavigationMenu.Content className="NavigationMenuContent">
    					<ul className="List two">
    						<ListItem
    							title="Introduction"
    							href="/primitives/docs/overview/introduction"
    						>
    							Build high-quality, accessible design systems and web apps.
    						</ListItem>
    						<ListItem
    							title="Getting started"
    							href="/primitives/docs/overview/getting-started"
    						>
    							A quick tutorial to get you up and running with Radix
    							Primitives.
    						</ListItem>
    						<ListItem title="Styling" href="/primitives/docs/guides/styling">
    							Unstyled and compatible with any styling solution.
    						</ListItem>
    						<ListItem
    							title="Animation"
    							href="/primitives/docs/guides/animation"
    						>
    							Use CSS keyframes or any animation library of your choice.
    						</ListItem>
    						<ListItem
    							title="Accessibility"
    							href="/primitives/docs/overview/accessibility"
    						>
    							Tested in a range of browsers and assistive technologies.
    						</ListItem>
    						<ListItem
    							title="Releases"
    							href="/primitives/docs/overview/releases"
    						>
    							Radix Primitives releases and their changelogs.
    						</ListItem>
    					</ul>
    				</NavigationMenu.Content>
    			</NavigationMenu.Item>

    			<NavigationMenu.Item>
    				<NavigationMenu.Link
    					className="NavigationMenuLink"
    					href="https://github.com/radix-ui"
    				>
    					Github
    				</NavigationMenu.Link>
    			</NavigationMenu.Item>

    			<NavigationMenu.Indicator className="NavigationMenuIndicator">
    				<div className="Arrow" />
    			</NavigationMenu.Indicator>
    		</NavigationMenu.List>

    		<div className="ViewportPosition">
    			<NavigationMenu.Viewport className="NavigationMenuViewport" />
    		</div>
    	</NavigationMenu.Root>
    );

};

const ListItem = React.forwardRef(
({ className, children, title, ...props }, forwardedRef) => (
<li>
<NavigationMenu.Link asChild>
<a
className={classNames("ListItemLink", className)}
{...props}
ref={forwardedRef} >
<div className="ListItemHeading">{title}</div>
<p className="ListItemText">{children}</p>
</a>
</NavigationMenu.Link>
</li>
),
);

export default NavigationMenuDemo;
Features
Can be controlled or uncontrolled.

Flexible layout structure with managed tab focus.

Supports submenus.

Optional active item indicator.

Full keyboard navigation.

Exposes CSS variables for advanced animation.

Supports custom timings.

Component Reference Links
Version: 1.2.5

Size: 9.31 kB

View source
Report an issue
ARIA design pattern
Installation
Install the component from your command line.

npm install @radix-ui/react-navigation-menu
Anatomy
Import all parts and piece them together.

import { NavigationMenu } from "radix-ui";

export default () => (
<NavigationMenu.Root>
<NavigationMenu.List>
<NavigationMenu.Item>
<NavigationMenu.Trigger />
<NavigationMenu.Content>
<NavigationMenu.Link />
</NavigationMenu.Content>
</NavigationMenu.Item>

    		<NavigationMenu.Item>
    			<NavigationMenu.Link />
    		</NavigationMenu.Item>

    		<NavigationMenu.Item>
    			<NavigationMenu.Trigger />
    			<NavigationMenu.Content>
    				<NavigationMenu.Sub>
    					<NavigationMenu.List />
    					<NavigationMenu.Viewport />
    				</NavigationMenu.Sub>
    			</NavigationMenu.Content>
    		</NavigationMenu.Item>

    		<NavigationMenu.Indicator />
    	</NavigationMenu.List>

    	<NavigationMenu.Viewport />
    </NavigationMenu.Root>

);
API Reference
Root
Contains all the parts of a navigation menu.

Prop Type Default
defaultValue
string
No default value
value
string
No default value
onValueChange
function
No default value
delayDuration
number
200
skipDelayDuration
number
300
dir
enum
No default value
orientation
enum
"horizontal"
Data attribute Values
[data-orientation] "vertical" | "horizontal"
Sub
Signifies a submenu. Use it in place of the root part when nested to create a submenu.

Prop Type Default
defaultValue
string
No default value
value
string
No default value
onValueChange
function
No default value
orientation
enum
"horizontal"
Data attribute Values
[data-orientation] "vertical" | "horizontal"
List
Contains the top level menu items.

Prop Type Default
asChild
boolean
false
Data attribute Values
[data-orientation] "vertical" | "horizontal"
Item
A top level menu item, contains a link or trigger with content combination.

Prop Type Default
asChild
boolean
false
value
string
No default value
Trigger
The button that toggles the content.

Prop Type Default
asChild
boolean
false
Data attribute Values
[data-state] "open" | "closed"
[data-disabled]
Present when disabled

Content
Contains the content associated with each trigger.

Prop Type Default
asChild
boolean
false
onEscapeKeyDown
function
No default value
onPointerDownOutside
function
No default value
onFocusOutside
function
No default value
onInteractOutside
function
No default value
forceMount
boolean
No default value
Data attribute Values
[data-state] "open" | "closed"
[data-motion] "to-start" | "to-end" | "from-start" | "from-end"
[data-orientation] "vertical" | "horizontal"
Link
A navigational link.

Prop Type Default
asChild
boolean
false
active
boolean
false
onSelect
function
No default value
Data attribute Values
[data-active]
Present when active

Indicator
An optional indicator element that renders below the list, is used to highlight the currently active trigger.

Prop Type Default
asChild
boolean
false
forceMount
boolean
No default value
Data attribute Values
[data-state] "visible" | "hidden"
[data-orientation] "vertical" | "horizontal"
Viewport
An optional viewport element that is used to render active content outside of the list.

Prop Type Default
asChild
boolean
false
forceMount
boolean
No default value
Data attribute Values
[data-state] "open" | "closed"
[data-orientation] "vertical" | "horizontal"
CSS Variable Description
--radix-navigation-menu-viewport-width The width of the viewport when visible/hidden, computed from the active content
--radix-navigation-menu-viewport-height The height of the viewport when visible/hidden, computed from the active content
Examples
Vertical
You can create a vertical menu by using the orientation prop.

<NavigationMenu.Root orientation="vertical">
<NavigationMenu.List>
<NavigationMenu.Item>
<NavigationMenu.Trigger>Item one</NavigationMenu.Trigger>
<NavigationMenu.Content>Item one content</NavigationMenu.Content>
</NavigationMenu.Item>
<NavigationMenu.Item>
<NavigationMenu.Trigger>Item two</NavigationMenu.Trigger>
<NavigationMenu.Content>Item Two content</NavigationMenu.Content>
</NavigationMenu.Item>
</NavigationMenu.List>
</NavigationMenu.Root>
Flexible layouts
Use the Viewport part when you need extra control over where Content is rendered. This can be helpful when your design requires an adjusted DOM structure or if you need flexibility to achieve advanced animation. Tab focus will be maintained automatically.

<NavigationMenu.Root>
<NavigationMenu.List>
<NavigationMenu.Item>
<NavigationMenu.Trigger>Item one</NavigationMenu.Trigger>
<NavigationMenu.Content>Item one content</NavigationMenu.Content>
</NavigationMenu.Item>
<NavigationMenu.Item>
<NavigationMenu.Trigger>Item two</NavigationMenu.Trigger>
<NavigationMenu.Content>Item two content</NavigationMenu.Content>
</NavigationMenu.Item>
</NavigationMenu.List>

    {/* NavigationMenu.Content will be rendered here when active */}
    <NavigationMenu.Viewport />

</NavigationMenu.Root>
With indicator
You can use the optional Indicator part to highlight the currently active Trigger, this is useful when you want to provide an animated visual cue such as an arrow or highlight to accompany the Viewport.

// index.jsx
import { NavigationMenu } from "radix-ui";
import "./styles.css";

export default () => (
<NavigationMenu.Root>
<NavigationMenu.List>
<NavigationMenu.Item>
<NavigationMenu.Trigger>Item one</NavigationMenu.Trigger>
<NavigationMenu.Content>Item one content</NavigationMenu.Content>
</NavigationMenu.Item>
<NavigationMenu.Item>
<NavigationMenu.Trigger>Item two</NavigationMenu.Trigger>
<NavigationMenu.Content>Item two content</NavigationMenu.Content>
</NavigationMenu.Item>

    		<NavigationMenu.Indicator className="NavigationMenuIndicator" />
    	</NavigationMenu.List>

    	<NavigationMenu.Viewport />
    </NavigationMenu.Root>

);
/_ styles.css _/
.NavigationMenuIndicator {
background-color: grey;
}
.NavigationMenuIndicator[data-orientation="horizontal"] {
height: 3px;
transition:
width,
transform,
250ms ease;
}
With submenus
Create a submenu by nesting your NavigationMenu and using the Sub part in place of its Root. Submenus work differently to Root navigation menus and are similar to Tabs in that one item should always be active, so be sure to assign and set a defaultValue.

<NavigationMenu.Root>
<NavigationMenu.List>
<NavigationMenu.Item>
<NavigationMenu.Trigger>Item one</NavigationMenu.Trigger>
<NavigationMenu.Content>Item one content</NavigationMenu.Content>
</NavigationMenu.Item>
<NavigationMenu.Item>
<NavigationMenu.Trigger>Item two</NavigationMenu.Trigger>
<NavigationMenu.Content>
<NavigationMenu.Sub defaultValue="sub1">
<NavigationMenu.List>
<NavigationMenu.Item value="sub1">
<NavigationMenu.Trigger>Sub item one</NavigationMenu.Trigger>
<NavigationMenu.Content>
Sub item one content
</NavigationMenu.Content>
</NavigationMenu.Item>
<NavigationMenu.Item value="sub2">
<NavigationMenu.Trigger>Sub item two</NavigationMenu.Trigger>
<NavigationMenu.Content>
Sub item two content
</NavigationMenu.Content>
</NavigationMenu.Item>
</NavigationMenu.List>
</NavigationMenu.Sub>
</NavigationMenu.Content>
</NavigationMenu.Item>
</NavigationMenu.List>
</NavigationMenu.Root>
With client side routing
If you need to use the Link component provided by your routing package then we recommend composing with NavigationMenu.Link via a custom component. This will ensure accessibility and consistent keyboard control is maintained. Here's an example using Next.js:

// index.jsx
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { NavigationMenu } from "radix-ui";
import "./styles.css";

const Link = ({ href, ...props }) => {
const pathname = usePathname();
const isActive = href === pathname;

    return (
    	<NavigationMenu.Link asChild active={isActive}>
    		<NextLink href={href} className="NavigationMenuLink" {...props} />
    	</NavigationMenu.Link>
    );

};

export default () => (
<NavigationMenu.Root>
<NavigationMenu.List>
<NavigationMenu.Item>
<Link href="/">Home</Link>
</NavigationMenu.Item>
<NavigationMenu.Item>
<Link href="/about">About</Link>
</NavigationMenu.Item>
</NavigationMenu.List>
</NavigationMenu.Root>
);
/_ styles.css _/
.NavigationMenuLink {
text-decoration: none;
}
.NavigationMenuLink[data-active] {
text-decoration: "underline";
}
Advanced animation
We expose --radix-navigation-menu-viewport-[width|height] and data-motion['from-start'|'to-start'|'from-end'|'to-end'] attributes to allow you to animate Viewport size and Content position based on the enter/exit direction.

Combining these with position: absolute; allows you to create smooth overlapping animation effects when moving between items.

// index.jsx
import { NavigationMenu } from "radix-ui";
import "./styles.css";

export default () => (
<NavigationMenu.Root>
<NavigationMenu.List>
<NavigationMenu.Item>
<NavigationMenu.Trigger>Item one</NavigationMenu.Trigger>
<NavigationMenu.Content className="NavigationMenuContent">
Item one content
</NavigationMenu.Content>
</NavigationMenu.Item>
<NavigationMenu.Item>
<NavigationMenu.Trigger>Item two</NavigationMenu.Trigger>
<NavigationMenu.Content className="NavigationMenuContent">
Item two content
</NavigationMenu.Content>
</NavigationMenu.Item>
</NavigationMenu.List>

    	<NavigationMenu.Viewport className="NavigationMenuViewport" />
    </NavigationMenu.Root>

);
/_ styles.css _/
.NavigationMenuContent {
position: absolute;
top: 0;
left: 0;
animation-duration: 250ms;
animation-timing-function: ease;
}
.NavigationMenuContent[data-motion="from-start"] {
animation-name: enterFromLeft;
}
.NavigationMenuContent[data-motion="from-end"] {
animation-name: enterFromRight;
}
.NavigationMenuContent[data-motion="to-start"] {
animation-name: exitToLeft;
}
.NavigationMenuContent[data-motion="to-end"] {
animation-name: exitToRight;
}

.NavigationMenuViewport {
position: relative;
width: var(--radix-navigation-menu-viewport-width);
height: var(--radix-navigation-menu-viewport-height);
transition:
width,
height,
250ms ease;
}

@keyframes enterFromRight {
from {
opacity: 0;
transform: translateX(200px);
}
to {
opacity: 1;
transform: translateX(0);
}
}

@keyframes enterFromLeft {
from {
opacity: 0;
transform: translateX(-200px);
}
to {
opacity: 1;
transform: translateX(0);
}
}

@keyframes exitToRight {
from {
opacity: 1;
transform: translateX(0);
}
to {
opacity: 0;
transform: translateX(200px);
}
}

@keyframes exitToLeft {
from {
opacity: 1;
transform: translateX(0);
}
to {
opacity: 0;
transform: translateX(-200px);
}
}
Accessibility
Adheres to the
navigation
role requirements.

Differences to menubar
NavigationMenu should not be confused with menubar, although this primitive shares the name menu in the colloquial sense to refer to a set of navigation links, it does not use the WAI-ARIA menu role. This is because menu and menubars behave like native operating system menus most commonly found in desktop application windows, as such they feature complex functionality like composite focus management and first-character navigation.

These features are often considered unnecessary for website navigation and at worst can confuse users who are familiar with established website patterns.

See the W3C Disclosure Navigation Menu example for more information.

Link usage and aria-current
It's important to use NavigationMenu.Link for all navigational links within a menu, this not only applies to the main list but also within any content rendered via NavigationMenu.Content. This will ensure consistent keyboard interactions and accessibility while also giving access to the active prop for setting aria-current and the active styles. See this example for more information on usage with third party routing components.

Keyboard Interactions
Key Description
When focus is on NavigationMenu.Trigger, opens the content.
Moves focus to the next focusable element.
When horizontal and focus is on an open NavigationMenu.Trigger, moves focus into NavigationMenu.Content.
Moves focus to the next NavigationMenu.Trigger or NavigationMenu.Link.
Moves focus to the previous NavigationMenu.Trigger or NavigationMenu.Link.
When vertical and focus is on an open NavigationMenu.Trigger, moves focus into its NavigationMenu.Content.
Moves focus to the next / previous NavigationMenu.Trigger or NavigationMenu.Link.
Moves focus to the first/last NavigationMenu.Trigger or NavigationMenu.Link.
Closes open NavigationMenu.Content and moves focus to its NavigationMenu.Trigger.
Quick nav
Installation
Anatomy
API Reference
Root
Sub
List
Item
Trigger
Content
Link
Indicator
Viewport
Examples
Vertical
Flexible layouts
With indicator
With submenus
With client side routing
Advanced animation
Accessibility
Differences to menubar
Link usage and aria-current
Keyboard Interactions
Previous
Menubar
