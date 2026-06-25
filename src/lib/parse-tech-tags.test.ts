import { describe, expect, it } from "vitest"
import { formatTechTags, parseTechTags } from "./parse-tech-tags"

describe("parseTechTags", () => {
  it("splits comma-separated tags and trims whitespace", () => {
    expect(parseTechTags("react, convex , rust")).toEqual([
      "react",
      "convex",
      "rust",
    ])
  })

  it("splits on newlines", () => {
    expect(parseTechTags("react\nconvex")).toEqual(["react", "convex"])
  })

  it("filters empty segments", () => {
    expect(parseTechTags("react,, convex,")).toEqual(["react", "convex"])
  })

  it("caps at the profile tech tag limit", () => {
    expect(parseTechTags("a,b,c,d,e,f,g,h,i,j")).toEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
    ])
  })
})

describe("formatTechTags", () => {
  it("joins tags with comma and space", () => {
    expect(formatTechTags(["react", "convex"])).toBe("react, convex")
  })
})
