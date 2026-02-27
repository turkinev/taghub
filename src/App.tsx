import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TagsPage from "./pages/TagsPage";
import TagAssignmentPage from "./pages/TagAssignmentPage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionEditorPage from "./pages/CollectionEditorPage";
import PostsPage from "./pages/PostsPage";
import PostEditorPage from "./pages/PostEditorPage";
import PostCommentsPage from "./pages/PostCommentsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/tags" replace />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/tag-assignment" element={<TagAssignmentPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/new" element={<CollectionEditorPage />} />
          <Route path="/collections/:id/edit" element={<CollectionEditorPage />} />
          <Route path="/admin/posts" element={<PostsPage />} />
          <Route path="/admin/posts/new" element={<PostEditorPage />} />
          <Route path="/admin/posts/:id/edit" element={<PostEditorPage />} />
          <Route path="/admin/posts/:id/comments" element={<PostCommentsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
