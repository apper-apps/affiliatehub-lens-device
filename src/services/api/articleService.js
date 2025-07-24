import articlesData from "@/services/mockData/articles.json"

export const ArticleService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...articlesData]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const article = articlesData.find(article => article.Id === id)
    if (!article) {
      throw new Error("Article not found")
    }
    return { ...article }
  },

  async create(articleData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newId = Math.max(...articlesData.map(a => a.Id)) + 1
    const newArticle = {
      Id: newId,
      ...articleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    articlesData.push(newArticle)
    return { ...newArticle }
  },

  async update(id, articleData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = articlesData.findIndex(article => article.Id === id)
    if (index === -1) {
      throw new Error("Article not found")
    }
    
    articlesData[index] = {
      ...articlesData[index],
      ...articleData,
      updatedAt: new Date().toISOString()
    }
    return { ...articlesData[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = articlesData.findIndex(article => article.Id === id)
    if (index === -1) {
      throw new Error("Article not found")
    }
    
    const deleted = articlesData.splice(index, 1)[0]
    return { ...deleted }
  }
}