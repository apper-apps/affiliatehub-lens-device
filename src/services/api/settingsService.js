import settingsData from "@/services/mockData/settings.json"

let currentSettings = { ...settingsData }

export const SettingsService = {
  async get() {
    await new Promise(resolve => setTimeout(resolve, 200))
    return { ...currentSettings }
  },

  async update(settingsUpdate) {
    await new Promise(resolve => setTimeout(resolve, 300))
    currentSettings = {
      ...currentSettings,
      ...settingsUpdate
    }
    return { ...currentSettings }
  }
}