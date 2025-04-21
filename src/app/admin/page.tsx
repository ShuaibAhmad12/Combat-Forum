"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Pencil, Trash2, Eye, Loader2, X } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/rich-text-editor"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AdminPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [deletePostId, setDeletePostId] = useState<Id<"posts"> | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
  })
  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch posts
  const posts = useQuery(api.posts.getAll)

  // Mutations
  const createPost = useMutation(api.posts.create)
  const updatePost = useMutation(api.posts.update)
  const deletePost = useMutation(api.posts.remove)

  // Check if user is admin
  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata?.role !== "admin")) {
      toast("You don't have permission to access this page.")
      router.push("/")
    }
  }, [isLoaded, user, router])

  const validateForm = () => {
    const errors = {
      title: "",
      description: "",
      content: "",
      category: "",
    }

    if (!formData.title.trim()) {
      errors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required"
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required"
    }

    if (!formData.category.trim()) {
      errors.category = "Category is required"
    }

    setFormErrors(errors)

    return !Object.values(errors).some((error) => error)
  }


  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check if file is a jpg/jpeg
      if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
        toast("Please upload a JPG image");
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRichTextChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Update your handleCreatePost function
  
  const handleCreatePost = async () => {
    if (!validateForm() || !user) return;

    setIsSubmitting(true);

    try {
      let imageId = null;

      // Upload image if one is selected
      if (imageFile) {
        const uploadUrl = await generateUploadUrl();

        // Upload the file to the generated URL
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });

        const { storageId } = await result.json();
        imageId = storageId;
      }

      await createPost({
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        authorId: user.id,
        authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Admin",
        authorImageUrl: user.imageUrl,
        imageId: imageId,
      });

      setFormData({ title: "", description: "", content: "", category: "" });
      setImageFile(null);
      setImagePreview(null);
      setIsCreating(false);

      toast("Post created successfully.");
    } catch (error) {
      toast("Failed to create post. Please try again.");
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePost = async () => {
    if (!validateForm() || !editingPost) return

    setIsSubmitting(true)

    try {
      await updatePost({
        id: editingPost._id,
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
      })

      setFormData({ title: "", description: "", content: "", category: "" })
      setEditingPost(null)

      toast("Post updated successfully.")
    } catch (error) {
      toast("Failed to update post. Please try again.")
      console.error("Error updating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePost = async () => {
    if (!deletePostId) return

    try {
      await deletePost({ id: deletePostId })

      setDeletePostId(null)

      toast("Post deleted successfully.")
    } catch (error) {
      toast("Failed to delete post. Please try again.")
      console.error("Error deleting post:", error)
    }
  }

  const startEditing = (post: any) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      description: post.description,
      content: post.content,
      category: post.category,
    })
  }

  if (!isLoaded || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-10">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          <Tabs defaultValue="posts">
            <TabsList className="mb-6">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Manage Posts</h2>
                {!isCreating && !editingPost && (
                  <Button onClick={() => setIsCreating(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Post
                  </Button>
                )}
              </div>

              {(isCreating || editingPost) && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>{editingPost ? "Edit Post" : "Create New Post"}</CardTitle>
                    <CardDescription>
                      {editingPost ? "Update your blog post details" : "Fill in the details for your new blog post"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image">Post Image (JPG only)</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="image"
                          type="file"
                          accept="image/jpeg,image/jpg"
                          onChange={handleImageChange}
                        />
                        {imagePreview && (
                          <div className="relative w-24 h-24">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-md"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-0 right-0 bg-black/50 rounded-full p-1"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview(null);
                              }}
                            >
                              <X className="h-4 w-4 text-white" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter post title"
                        className={formErrors.title ? "border-red-500" : ""}
                      />
                      {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="Enter category (e.g., MMA, Boxing)"
                        className={formErrors.category ? "border-red-500" : ""}
                      />
                      {formErrors.category && <p className="text-xs text-red-500">{formErrors.category}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <div className={formErrors.description ? "border-red-500 rounded-md" : ""}>
                        <RichTextEditor
                          content={formData.description}
                          onChange={(value) => handleRichTextChange("description", value)}
                          // placeholder="Enter a short description"
                          // minHeight="100px"
                        />
                      </div>
                      {formErrors.description && <p className="text-xs text-red-500">{formErrors.description}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <div className={formErrors.content ? "border-red-500 rounded-md" : ""}>
                        <RichTextEditor
                          content={formData.content}
                          onChange={(value) => handleRichTextChange("content", value)}
                          // placeholder="Enter post content"
                          // minHeight="300px"
                        />
                      </div>
                      {formErrors.content && <p className="text-xs text-red-500">{formErrors.content}</p>}
                    </div>
                    
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false)
                        setEditingPost(null)
                        setFormData({ title: "", description: "", content: "", category: "" })
                        setFormErrors({ title: "", description: "", content: "", category: "" })
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button onClick={editingPost ? handleUpdatePost : handleCreatePost} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {editingPost ? "Updating..." : "Creating..."}
                        </>
                      ) : editingPost ? (
                        "Update Post"
                      ) : (
                        "Create Post"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {!posts ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No posts found. Create your first post!</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Comments</TableHead>
                        <TableHead>Likes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => (
                        <TableRow key={post._id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>{post.category}</TableCell>
                          <TableCell>
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell>{post.commentCount}</TableCell>
                          <TableCell>{post.likeCount}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/blog/${post.slug}`}>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startEditing(post)}
                                disabled={isCreating || !!editingPost}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeletePostId(post._id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="comments">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Manage Comments</h2>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">Comment management functionality would be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Blog Settings</h2>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">Blog settings would be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <AlertDialog open={!!deletePostId} onOpenChange={(open: any) => !open && setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post and all associated comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
