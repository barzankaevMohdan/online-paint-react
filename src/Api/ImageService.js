import $api from ".";

export default class PostService {
  static async getImage(id) {
    return await $api.get(`/image?id=${id}`)
  }

  static async postImage(id, img) {
    return await $api.post(`/image?id=${id}`, {img})
  }
}