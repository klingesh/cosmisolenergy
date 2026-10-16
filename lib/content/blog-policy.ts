export function publicBlogFilter(){return{status:'published' as const}}
export async function assertUniqueSlug(repository:{findBySlug(slug:string):Promise<{id:string}|null>},slug:string,currentId?:string){const match=await repository.findBySlug(slug);if(match&&match.id!==currentId)throw new Error('This slug is already in use.')}
