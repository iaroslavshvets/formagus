# Route Component

Any component passed as a child to `<Router>` is called a "Route Component". There are three types of props for Route Components.

1. **Matching Props** - You provide these props where the `<Router>` is rendered. They are used by `Router` to match the component against the location to see if the component should be rendered. But, they're not really all that important to the component itself. Think of these like the `key` prop in React. Your component doesn't really care about it, but it's information React needs in the parent.

2. **Route Props** - These props are passed to your component by `Router` when your component matches the URL: URL parameters and `navigate` are a couple of them. They are all documented on this page.

3. **Other Props** - Route Components are your own components so go ahead and pass them whatever props they need.

## path: string

<p class="category">matching prop</p>

Used to match your component to the location. When it matches, the component will be rendered.

```jsx
<Router>
  <Home path="/" />
  <Dashboard path="dashboard" />
</Router>
```

At "/", Router will render `<Home/>`. At "/dashboard", Router will render `<Dashboard/>`.

### URL Parameters with Dynamic Segments

You can make a segment dynamic with `:someName`. Router will parse the value out of the URL and pass it to your component as a prop by the same name.

```jsx
<Router>
  <Dashboard path="dashboard" />
  <Invoice path="invoice/:invoiceId" />
</Router>
```

At "invoice/10023", Router will render `<Invoice invoiceId="10023"/>`.

**Reserved Names**: You can name your parameters anything want except `uri` and `path`. You'll get a warning if you try, so don’t worry if you didn’t actually read these docs (... 🤔).

