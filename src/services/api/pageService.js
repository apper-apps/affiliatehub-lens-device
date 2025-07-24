import pagesData from "@/services/mockData/pages.json"

export const PageService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...pagesData]
  },

  async getBySlug(slug) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const page = pagesData.find(page => page.slug === slug)
    if (!page) {
      throw new Error("Page not found")
    }
    return { ...page }
  },

  async update(slug, pageData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = pagesData.findIndex(page => page.slug === slug)
    
    if (index === -1) {
      // Create new page if it doesn't exist
      const newId = Math.max(...pagesData.map(p => p.Id)) + 1
      const newPage = {
        Id: newId,
        slug,
        ...pageData,
        updatedAt: new Date().toISOString()
      }
      pagesData.push(newPage)
      return { ...newPage }
    }
    
    pagesData[index] = {
      ...pagesData[index],
      ...pageData,
      updatedAt: new Date().toISOString()
    }
    return { ...pagesData[index] }
  }
}