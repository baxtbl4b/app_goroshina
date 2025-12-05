"use client"

const React = require("react")

// Create a useEffectEvent function that uses useCallback as a fallback
function useEffectEvent(callback) {
  return React.useCallback(callback, [])
}

// Export the function
exports.useEffectEvent = useEffectEvent
exports.default = useEffectEvent
module.exports = useEffectEvent
