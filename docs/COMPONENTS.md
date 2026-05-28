# KhmerCareer Component Documentation

Complete guide to using and extending KhmerCareer UI components.

## Table of Contents

1. [Design System](#design-system)
2. [Base Components](#base-components)
3. [Form Components](#form-components)
4. [Data Display Components](#data-display-components)
5. [Feedback Components](#feedback-components)
6. [Navigation Components](#navigation-components)
7. [Overlay Components](#overlay-components)
8. [Page Components](#page-components)
9. [Creating Custom Components](#creating-custom-components)
10. [Component Props Reference](#component-props-reference)

---

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--gold` | `#D4A574` | Primary brand color |
| `--gold-light` | `#E8C9A0` | Hover states |
| `--gold-dark` | `#B8925F` | Active states |
| `--warm-white` | `#FAF8F5` | Page background |
| `--warm-gray` | `#6B6560` | Secondary text |
| `--dark` | `#1A1A1A` | Primary text |
| `--success` | `#22C55E` | Success states |
| `--warning` | `#F59E0B` | Warning states |
| `--error` | `#EF4444` | Error states |
| `--info` | `#3B82F6` | Info states |

### Typography

| Style | Size | Weight | Line Height |
|-------|------|--------|-------------|
| H1 | 2.5rem (40px) | 700 | 1.2 |
| H2 | 2rem (32px) | 600 | 1.3 |
| H3 | 1.5rem (24px) | 600 | 1.4 |
| H4 | 1.25rem (20px) | 600 | 1.4 |
| Body | 1rem (16px) | 400 | 1.6 |
| Small | 0.875rem (14px) | 400 | 1.5 |
| Caption | 0.75rem (12px) | 400 | 1.5 |

### Spacing Scale

| Token | Value |
|-------|-------|
| `space-1` | 0.25rem (4px) |
| `space-2` | 0.5rem (8px) |
| `space-3` | 0.75rem (12px) |
| `space-4` | 1rem (16px) |
| `space-6` | 1.5rem (24px) |
| `space-8` | 2rem (32px) |
| `space-12` | 3rem (48px) |
| `space-16` | 4rem (64px) |

---

## Base Components

### Button

```tsx
import { Button } from '@/components/ui/button';

// Variants
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// States
<Button disabled>Disabled</Button>
<Button isLoading>Loading</Button>

// With icon
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Job
</Button>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `default \| secondary \| destructive \| outline \| ghost \| link` | `default` | Visual style |
| `size` | `sm \| default \| lg \| icon` | `default` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `isLoading` | `boolean` | `false` | Loading spinner |
| `onClick` | `() => void` | - | Click handler |

---

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Job Title</CardTitle>
    <CardDescription>Company Name • Location</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Job description content...</p>
  </CardContent>
  <CardFooter>
    <Button>Apply Now</Button>
  </CardFooter>
</Card>
```

---

### Input

```tsx
import { Input } from '@/components/ui/input';

// Basic usage
<Input placeholder="Enter email" />

// With label and error
<div>
  <label>Email</label>
  <Input type="email" error={errors.email} />
  {errors.email && <span className="text-red-500">{errors.email}</span>}
</div>

// Sizes
<Input size="sm" />
<Input size="default" />
<Input size="lg" />
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `text \| email \| password \| number \| tel \| url` | `text` | Input type |
| `placeholder` | `string` | - | Placeholder text |
| `error` | `string` | - | Error message |
| `disabled` | `boolean` | `false` | Disabled state |

---

### Badge

```tsx
import { Badge } from '@/components/ui/badge';

// Variants
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Rejected</Badge>
<Badge variant="outline">Outline</Badge>

// Usage examples
<Badge>Full-time</Badge>
<Badge variant="secondary">Remote</Badge>
<Badge className="bg-green-100 text-green-800">Active</Badge>
```

---

### Avatar

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Sizes
<Avatar className="h-8 w-8" />   // Small
<Avatar className="h-10 w-10" /> // Default
<Avatar className="h-12 w-12" /> // Large
```

---

## Form Components

### Form (React Hook Form + Zod)

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

---

### Select

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a role" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="jobseeker">Job Seeker</SelectItem>
    <SelectItem value="employer">Employer</SelectItem>
    <SelectItem value="admin">Admin</SelectItem>
  </SelectContent>
</Select>
```

---

### Checkbox

```tsx
import { Checkbox } from '@/components/ui/checkbox';

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms">I agree to the terms</label>
</div>
```

---

### Textarea

```tsx
import { Textarea } from '@/components/ui/textarea';

<Textarea
  placeholder="Write your cover letter..."
  rows={6}
/>
```

---

## Data Display Components

### Data Table

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Job Title</TableHead>
      <TableHead>Company</TableHead>
      <TableHead>Location</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {jobs.map((job) => (
      <TableRow key={job.id}>
        <TableCell className="font-medium">{job.title}</TableCell>
        <TableCell>{job.company}</TableCell>
        <TableCell>{job.location}</TableCell>
        <TableCell>
          <Badge>{job.status}</Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

### Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="jobs">
  <TabsList>
    <TabsTrigger value="jobs">Jobs</TabsTrigger>
    <TabsTrigger value="courses">Courses</TabsTrigger>
    <TabsTrigger value="applications">Applications</TabsTrigger>
  </TabsList>
  <TabsContent value="jobs"><JobList /></TabsContent>
  <TabsContent value="courses"><CourseList /></TabsContent>
  <TabsContent value="applications"><ApplicationList /></TabsContent>
</Tabs>
```

---

### Accordion

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Job Requirements</AccordionTrigger>
    <AccordionContent>
      <ul>
        <li>Bachelor's degree in Computer Science</li>
        <li>3+ years of experience</li>
      </ul>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## Feedback Components

### Toast Notifications

```tsx
import { toast } from 'sonner';

// Success
toast.success('Application submitted successfully!');

// Error
toast.error('Failed to submit application');

// With description
toast.success('Job posted', {
  description: 'Your job is now live and visible to candidates.',
});

// With action
toast.info('New application received', {
  action: {
    label: 'View',
    onClick: () => navigate('/applications'),
  },
});
```

---

### Alert Dialog

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Account</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. Your account will be permanently deleted.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

### Skeleton Loading

```tsx
import { Skeleton } from '@/components/ui/skeleton';

function JobCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
```

---

## Navigation Components

### Navbar

```tsx
import Navbar from '@/components/Navbar';

// Navbar is included in Layout component
function App() {
  return (
    <Layout>
      <Routes>{/* routes */}</Routes>
    </Layout>
  );
}
```

**Navbar Features:**
- Responsive design with mobile hamburger menu
- Active route highlighting
- User menu dropdown (when authenticated)
- Notification bell with badge
- Search bar
- Language switcher

---

### Breadcrumb

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/jobs">Jobs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Software Engineer</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

### Pagination

```tsx
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="?page=1" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="?page=1">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="?page=2" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="?page=3">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="?page=3" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

---

## Overlay Components

### Dialog (Modal)

```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Apply Now</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Apply for this position</DialogTitle>
      <DialogDescription>
        Fill out the form below to submit your application.
      </DialogDescription>
    </DialogHeader>
    <ApplicationForm />
  </DialogContent>
</Dialog>
```

---

### Dropdown Menu

```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">My Account</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Applications</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### Sheet (Side Panel)

```tsx
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Filters</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Job Filters</SheetTitle>
      <SheetDescription>
        Refine your job search with filters.
      </SheetDescription>
    </SheetHeader>
    <JobFilters />
  </SheetContent>
</Sheet>
```

---

### Tooltip

```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <Info className="h-4 w-4" />
    </TooltipTrigger>
    <TooltipContent>
      <p>Additional information about this field</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## Page Components

### Homepage (Home.tsx)

**Features:**
- Hero section with search
- Featured jobs carousel
- Popular courses section
- Statistics counter
- How it works section
- Testimonials

**Key Components Used:**
```tsx
import { Hero } from '@/components/Hero';
import { FeaturedJobs } from '@/components/FeaturedJobs';
import { PopularCourses } from '@/components/PopularCourses';
import { StatsCounter } from '@/components/StatsCounter';
```

---

### Job Listings (Jobs.tsx)

**Features:**
- Search bar with autocomplete
- Filter sidebar (location, industry, type, salary)
- Sort dropdown
- Job cards grid/list view
- Pagination
- Saved searches

**Key Components Used:**
```tsx
import { SearchBar } from '@/components/SearchBar';
import { JobFilters } from '@/components/JobFilters';
import { JobCard } from '@/components/JobCard';
import { Pagination } from '@/components/Pagination';
```

---

### Admin Dashboard (AdminDashboard.tsx)

**Features:**
- Statistics cards (users, jobs, courses, revenue)
- Charts (user growth, job postings, applications)
- Recent activity feed
- Quick actions

**Key Components Used:**
```tsx
import { StatsCards } from '@/admin/components/StatsCards';
import { UserGrowthChart } from '@/admin/components/UserGrowthChart';
import { RecentActivity } from '@/admin/components/RecentActivity';
```

---

## Creating Custom Components

### Component Template

```tsx
// components/MyComponent.tsx
import { cn } from '@/lib/utils';

interface MyComponentProps {
  title: string;
  description?: string;
  variant?: 'default' | 'primary' | 'danger';
  children?: React.ReactNode;
  onAction?: () => void;
  className?: string;
}

export function MyComponent({
  title,
  description,
  variant = 'default',
  children,
  onAction,
  className,
}: MyComponentProps) {
  const variantStyles = {
    default: 'bg-white border-gray-200',
    primary: 'bg-blue-50 border-blue-200',
    danger: 'bg-red-50 border-red-200',
  };

  return (
    <div className={cn(
      'rounded-lg border p-4',
      variantStyles[variant],
      className
    )}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
      {onAction && (
        <button onClick={onAction} className="mt-4 text-blue-600">
          Take Action
        </button>
      )}
    </div>
  );
}
```

### Best Practices

1. **Use TypeScript** - Define interfaces for all props
2. **Use `cn()` utility** - For conditional class merging
3. **Forward refs** - When wrapping native elements
4. **Support `className` prop** - For style overrides
5. **Use composition** - Prefer composition over configuration
6. **Keep components small** - Under 200 lines when possible
7. **Extract logic to hooks** - Keep components presentational
8. **Use React.memo** - For expensive renders
9. **Document with JSDoc** - For complex components

---

## Component Props Reference

### Common Props Pattern

Most components accept these common props:

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |
| `children` | `React.ReactNode` | Child content |
| `disabled` | `boolean` | Disabled state |
| `onClick` | `(e: MouseEvent) => void` | Click handler |

### shadcn/ui Components List

Complete list of available UI components:

- `Accordion` - Collapsible content sections
- `Alert` - Callout boxes for important messages
- `AlertDialog` - Confirmation dialogs
- `Avatar` - User profile images
- `Badge` - Status indicators
- `Breadcrumb` - Navigation breadcrumbs
- `Button` - Action buttons
- `Calendar` - Date picker
- `Card` - Content containers
- `Carousel` - Image/content sliders
- `Checkbox` - Form checkboxes
- `Collapsible` - Expandable sections
- `Combobox` - Autocomplete inputs
- `Command` - Command palette
- `ContextMenu` - Right-click menus
- `Dialog` - Modal windows
- `Drawer` - Slide-out panels
- `DropdownMenu` - Dropdown menus
- `Form` - Form building utilities
- `HoverCard` - Hover-triggered cards
- `Input` - Text inputs
- `InputOTP` - OTP code inputs
- `Label` - Form labels
- `Menubar` - Application menus
- `NavigationMenu` - Navigation menus
- `Pagination` - Page navigation
- `Popover` - Popover overlays
- `Progress` - Progress bars
- `RadioGroup` - Radio button groups
- `Resizable` - Resizable panels
- `ScrollArea` - Custom scrollbars
- `Select` - Dropdown selects
- `Separator` - Visual dividers
- `Sheet` - Side panels
- `Skeleton` - Loading placeholders
- `Slider` - Range sliders
- `Sonner` - Toast notifications
- `Switch` - Toggle switches
- `Table` - Data tables
- `Tabs` - Tabbed interfaces
- `Textarea` - Multi-line inputs
- `Toast` - Toast notifications
- `Toggle` - Toggle buttons
- `ToggleGroup` - Toggle button groups
- `Tooltip` - Hover tooltips
