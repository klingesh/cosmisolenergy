import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { ProjectEditor } from '@/components/admin/ProjectEditor';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/lib/content/blog-actions', () => ({ createBlogPost: vi.fn(), updateBlogPost: vi.fn(), deleteBlogPost: vi.fn() }));
vi.mock('@/lib/content/project-actions', () => ({ createProject: vi.fn(), updateProject: vi.fn(), deleteProject: vi.fn() }));
vi.mock('@/components/admin/RichTextEditor', () => ({ RichTextEditor: () => <div data-testid="rich-editor" /> }));
vi.mock('@/components/admin/MediaUploader', () => ({ MediaUploader: () => <button type="button">Upload image</button> }));

describe('admin content editors', () => {
  beforeEach(() => vi.clearAllMocks());

  it('exposes article author and SEO controls', () => {
    render(<BlogEditor />);
    expect(screen.getByLabelText('Author name')).toBeVisible();
    expect(screen.getByLabelText('SEO title')).toBeVisible();
    expect(screen.getByLabelText('SEO description')).toBeVisible();
    expect(screen.getByLabelText('Social image URL')).toBeVisible();
  });

  it('exposes proof fields and lets an editor add gallery images', () => {
    render(<ProjectEditor />);
    expect(screen.getByText('Customer challenge')).toBeVisible();
    expect(screen.getByLabelText('Generation value')).toBeVisible();
    expect(screen.getByLabelText('Savings value')).toBeVisible();
    expect(screen.getByLabelText('Customer testimonial')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Add gallery image' }));
    expect(screen.getAllByLabelText(/Gallery image URL/)).toHaveLength(2);
  });
});
