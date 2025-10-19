// Handle .well-known requests (like Chrome DevTools)
export function loader() {
  // Return a 404 response for .well-known requests
  return new Response(null, { status: 404 })
}

// This component won't be rendered since we return a Response in the loader
export default function WellKnown() {
  return null
}