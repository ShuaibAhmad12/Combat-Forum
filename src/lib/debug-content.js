// This is a utility file to help debug content issues
// You can use this in your development environment

export function debugHtmlContent(content) {
  console.log("Raw HTML content:", content)

  // Check for heading tags
  const h1Count = (content.match(/<h1/g) || []).length
  const h2Count = (content.match(/<h2/g) || []).length

  // Check for heading tags with attributes
  const h1WithAttrCount = (content.match(/<h1 [^>]+>/g) || []).length
  const h2WithAttrCount = (content.match(/<h2 [^>]+>/g) || []).length

  console.log("Number of h1 tags:", h1Count)
  console.log("Number of h1 tags with attributes:", h1WithAttrCount)
  console.log("Number of h2 tags:", h2Count)
  console.log("Number of h2 tags with attributes:", h2WithAttrCount)

  // Check for style attributes
  const styleCount = (content.match(/style="/g) || []).length
  console.log("Number of style attributes:", styleCount)

  // Check for specific styles
  const textAlignCount = (content.match(/text-align:/g) || []).length
  console.log("Number of text-align styles:", textAlignCount)

  // Check for data attributes that might be added by TipTap
  const dataTypeHeadingCount = (content.match(/data-type="heading"/g) || []).length
  console.log("Number of data-type='heading' attributes:", dataTypeHeadingCount)

  return {
    h1Count,
    h2Count,
    h1WithAttrCount,
    h2WithAttrCount,
    styleCount,
    textAlignCount,
    dataTypeHeadingCount,
  }
}
