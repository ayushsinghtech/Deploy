"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Star,
  Clock,
  Users,
  BookOpen,
  Play,
  Code,
  Database,
  Brain,
  Palette,
  Globe,
  Smartphone,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Type definitions
interface Concept {
  _id: string
  title: string
  description?: string
  level?: string
  category?: string
  conceptType?: string
  Concept_Type?: string
  complexity?: number
  estLearningTimeHours?: number
  Test_Questions?: any[]
}

interface Course {
  id: string
  title: string
  instructor: string
  description: string
  image: string
  rating: number
  students: string
  duration: string
  level: string
  conceptType: string
  concepts: number
  quizzes: number
  projects: number
  enrolled: boolean
  progress: number
  category: string
  skills: string[]
  complexity: number
}

export default function Courses() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Courses")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedSort, setSelectedSort] = useState("popular")
  const [showFilters, setShowFilters] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enrollmentStatus, setEnrollmentStatus] = useState<Record<string, { enrolled: boolean; progress: number }>>({})
  const [enrolling, setEnrolling] = useState<Record<string, boolean>>({})

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""
        const response = await fetch(`${API_BASE}/concepts`, {
          credentials: "include"
        })
        
        if (!response.ok) {
          throw new Error("Failed to fetch courses")
        }
        
        const data = await response.json()
        
        // Transform concept data to course format
        const transformedCourses = data.map((concept: Concept, index: number) => {
          // Generate dynamic image URL based on concept title and category
          const getImageUrl = (title: string, category?: string) => {
            // Create a hash from the title to get consistent images for the same concept
            const hash = title.split('').reduce((a, b) => {
              a = ((a << 5) - a) + b.charCodeAt(0)
              return a & a
            }, 0)
            const imageId = Math.abs(hash) % 1000 + 1
            
            // Map concepts to specific tech/DSA related search terms
            const getTechSearchTerm = (title: string, category?: string) => {
              const lowerTitle = title.toLowerCase()
              
              // DSA specific terms
              if (lowerTitle.includes('array') || lowerTitle.includes('list')) return 'data-structures,arrays,programming'
              if (lowerTitle.includes('tree') || lowerTitle.includes('binary')) return 'binary-trees,data-structures,algorithms'
              if (lowerTitle.includes('graph') || lowerTitle.includes('network')) return 'graph-algorithms,networks,data-structures'
              if (lowerTitle.includes('sort') || lowerTitle.includes('search')) return 'sorting-algorithms,search-algorithms,programming'
              if (lowerTitle.includes('dynamic') || lowerTitle.includes('dp')) return 'dynamic-programming,algorithms,optimization'
              if (lowerTitle.includes('recursion') || lowerTitle.includes('recursive')) return 'recursion,algorithms,programming'
              if (lowerTitle.includes('stack') || lowerTitle.includes('queue')) return 'stack-queue,data-structures,programming'
              if (lowerTitle.includes('hash') || lowerTitle.includes('map')) return 'hash-tables,data-structures,programming'
              if (lowerTitle.includes('heap') || lowerTitle.includes('priority')) return 'heap-data-structure,algorithms,programming'
              if (lowerTitle.includes('linked') || lowerTitle.includes('node')) return 'linked-lists,data-structures,programming'
              
              // General programming terms
              if (lowerTitle.includes('algorithm') || lowerTitle.includes('algo')) return 'algorithms,programming,computer-science'
              if (lowerTitle.includes('data structure') || lowerTitle.includes('ds')) return 'data-structures,programming,computer-science'
              if (lowerTitle.includes('complexity') || lowerTitle.includes('big o')) return 'algorithm-complexity,big-o-notation,computer-science'
              if (lowerTitle.includes('optimization') || lowerTitle.includes('efficiency')) return 'code-optimization,performance,programming'
              
              // Category-based fallbacks
              if (category?.toLowerCase().includes('programming')) return 'programming,coding,computer-science'
              if (category?.toLowerCase().includes('ai') || category?.toLowerCase().includes('ml')) return 'machine-learning,artificial-intelligence,technology'
              if (category?.toLowerCase().includes('web')) return 'web-development,programming,technology'
              if (category?.toLowerCase().includes('mobile')) return 'mobile-development,programming,technology'
              
              // Default tech terms
              return 'programming,coding,computer-science,technology'
            }
            
            const searchTerm = getTechSearchTerm(title, category)
            
            // Use a more reliable image service with tech-specific images
            const techImageUrls = [
              'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=400&fit=crop', // Code on screen
              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop', // Programming
              'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop', // Coding
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', // Computer science
              'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop', // Data visualization
              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', // Algorithm
              'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=400&fit=crop', // Data structures
              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop', // Technology
              'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=400&fit=crop', // Programming workspace
              'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop', // Code editor
            ]
            
            // Use hash to get consistent image for same concept
            return techImageUrls[imageId % techImageUrls.length]
          }

          return {
            id: concept._id,
            title: concept.title,
            instructor: "Masterly Team", // Default instructor
            description: concept.description || "Comprehensive learning material for this concept",
            image: getImageUrl(concept.title, concept.category),
            rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5-5.0
            students: `${Math.floor(Math.random() * 50) + 10}K+`, // Random student count
            duration: `${concept.estLearningTimeHours || 8} weeks`,
            level: concept.level || "Intermediate",
            conceptType: concept.Concept_Type || concept.conceptType || "Theory",
            concepts: 1, // Each concept is a single course
            quizzes: concept.Test_Questions?.length || 5,
            projects: Math.floor(Math.random() * 5) + 2,
            enrolled: false, // Will be updated by enrollment status
            progress: 0, // Will be updated by enrollment status
            category: concept.category || "Programming",
            skills: [concept.title], // Use concept title as primary skill
            complexity: concept.complexity || 3,
          }
        })
        
        setCourses(transformedCourses)
        setError(null)
      } catch (err) {
        console.error("Error fetching courses:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch courses")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user])

  // Fetch enrollment status for all courses
  useEffect(() => {
    const fetchEnrollmentStatus = async () => {
      if (!user || courses.length === 0) return

      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""
        const statusPromises = courses.map(async (course) => {
          try {
            const response = await fetch(`${API_BASE}/concepts/${course.id}/enrollment-status`, {
              credentials: "include"
            })
            if (response.ok) {
              const data = await response.json()
              return { [course.id]: data }
            }
            return { [course.id]: { enrolled: false, progress: 0 } }
          } catch (err) {
            return { [course.id]: { enrolled: false, progress: 0 } }
          }
        })

        const results = await Promise.all(statusPromises)
        const statusMap = results.reduce((acc, result) => ({ ...acc, ...result }), {})
        setEnrollmentStatus(statusMap)
      } catch (err) {
        console.error("Error fetching enrollment status:", err)
      }
    }

    fetchEnrollmentStatus()
  }, [user, courses])

  // Handle enrollment
  const handleEnroll = async (courseId: string) => {
    if (!user) return

    setEnrolling(prev => ({ ...prev, [courseId]: true }))

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""
      const response = await fetch(`${API_BASE}/concepts/${courseId}/enroll`, {
        method: 'POST',
        credentials: "include"
      })

      if (response.ok) {
        // Update enrollment status
        setEnrollmentStatus(prev => ({
          ...prev,
          [courseId]: { enrolled: true, progress: 0 }
        }))
      } else {
        const errorData = await response.json()
        console.error("Enrollment failed:", errorData.message)
      }
    } catch (err) {
      console.error("Enrollment error:", err)
    } finally {
      setEnrolling(prev => ({ ...prev, [courseId]: false }))
    }
  }

  // Dynamic categories based on available courses
  const getCategories = () => {
    const categoryCounts: Record<string, number> = {}
    courses.forEach(course => {
      const category = course.category || "Other"
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    })

    const categoryIcons: Record<string, any> = {
      "Programming": Code,
      "Data Science": Database,
      "AI/ML": Brain,
      "Design": Palette,
      "Web Dev": Globe,
      "Mobile": Smartphone,
      "Other": BookOpen
    }

    return [
      { name: "All Courses", count: courses.length, active: true, icon: BookOpen },
      ...Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count,
        icon: categoryIcons[name] || BookOpen
      }))
    ]
  }

  const categories = getCategories()

  // Remove the hardcoded allCourses array and use the dynamic courses state
  const allCourses = courses

  // Filter courses based on search and filters
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All Courses" || course.category === selectedCategory

    const matchesLevel =
      selectedLevel === "all" ||
      (selectedLevel === "beginner" && course.level.toLowerCase().includes("beginner")) ||
      (selectedLevel === "intermediate" && course.level.toLowerCase().includes("intermediate")) ||
      (selectedLevel === "advanced" && course.level.toLowerCase().includes("advanced"))

    return matchesSearch && matchesCategory && matchesLevel
  })

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (selectedSort) {
      case "rating":
        return b.rating - a.rating
      case "students":
        return Number.parseInt(b.students.replace(/\D/g, "")) - Number.parseInt(a.students.replace(/\D/g, ""))
      case "price-low":
        return a.conceptType.localeCompare(b.conceptType)
      case "price-high":
        return b.conceptType.localeCompare(a.conceptType)
      case "newest":
        return b.id.localeCompare(a.id)
      default: // popular
        return Number.parseInt(b.students.replace(/\D/g, "")) - Number.parseInt(a.students.replace(/\D/g, ""))
    }
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All Courses")
    setSelectedLevel("all")
    setSelectedSort("popular")
  }

  const hasActiveFilters =
    searchQuery || selectedCategory !== "All Courses" || selectedLevel !== "all" || selectedSort !== "popular"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Explore Courses</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Discover courses tailored to your learning goals</p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search courses, instructors, or topics..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" />}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Level</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Sort By</label>
                  <Select value={selectedSort} onValueChange={setSelectedSort}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Concept Type: A-Z</SelectItem>
                      <SelectItem value="price-high">Concept Type: Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 flex items-end">
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters} className="flex items-center">
                      <X className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Showing {sortedCourses.length} of {allCourses.length} courses
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Categories */}
          <div className="lg:col-span-1">
            <Card className="dark:bg-gray-800/80 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.name
                        ? "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {category.icon && <category.icon className="w-4 h-4" />}
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Courses Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <Card className="dark:bg-gray-800/80 dark:border-gray-700">
                <CardContent className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Loading courses...</h3>
                  <p className="text-gray-600 dark:text-gray-300">Fetching the latest courses from our database.</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="dark:bg-gray-800/80 dark:border-gray-700">
                <CardContent className="text-center py-12">
                  <div className="text-red-500 mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error loading courses</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </CardContent>
              </Card>
            ) : sortedCourses.length === 0 ? (
              <Card className="dark:bg-gray-800/80 dark:border-gray-700">
                <CardContent className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button onClick={clearFilters}>Clear all filters</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {sortedCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700"
                  >
                                        <div className="relative group">
                      <div className="w-full h-48 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 flex items-center justify-center overflow-hidden rounded-t-lg">
                      <Image
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        width={300}
                        height={200}
                          className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-105"
                          onError={(e) => {
                            // Try multiple fallback image services with tech-specific styling
                            const target = e.target as HTMLImageElement
                            
                            // Create professional tech-themed fallback images
                            const getTechFallbackImage = (title: string) => {
                              const techIcons = ['💻', '⚡', '🔧', '🚀', '🎯', '📊', '🔍', '⚙️', '🎮', '🌐']
                              const icon = techIcons[title.length % techIcons.length]
                              const shortTitle = title.substring(0, 15) + (title.length > 15 ? '...' : '')
                              
                              // Create a more professional gradient background
                              return `https://via.placeholder.com/600x400/1E40AF/FFFFFF?text=${encodeURIComponent(`${icon} ${shortTitle}`)}`
                            }
                            
                            // Professional tech fallback images
                            const fallbackImages = [
                              // Professional tech images from reliable sources
                              'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=400&fit=crop&auto=format',
                              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop&auto=format',
                              'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop&auto=format',
                              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format',
                              getTechFallbackImage(course.title)
                            ]
                            
                            // Try the next fallback image
                            const currentSrc = target.src
                            const currentIndex = fallbackImages.findIndex(img => img === currentSrc)
                            const nextIndex = (currentIndex + 1) % fallbackImages.length
                            target.src = fallbackImages[nextIndex]
                          }}
                          loading="lazy"
                        />
                        {/* Loading overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200">
                            View Course
                          </div>
                        </div>
                      </div>
                      <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700">{course.level}</Badge>
                      {enrollmentStatus[course.id]?.enrolled && (
                        <Badge className="absolute top-3 right-3 bg-green-500 text-white">Enrolled</Badge>
                      )}
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">({course.students})</span>
                        </div>
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">{course.conceptType}</span>
                      </div>

                      <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300">by {course.instructor}</p>
                      <CardDescription className="mt-2">{course.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {enrollmentStatus[course.id]?.enrolled && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-300">Progress</span>
                            <span className="font-medium">{enrollmentStatus[course.id]?.progress || 0}%</span>
                          </div>
                          <Progress value={enrollmentStatus[course.id]?.progress || 0} className="h-2" />
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.concepts}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{course.students}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Skills you'll learn:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {course.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {course.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{course.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {enrollmentStatus[course.id]?.enrolled ? (
                          <Button className="flex-1" asChild>
                            <Link href={`/courses/${course.id}`}>
                              <Play className="w-4 h-4 mr-2" />
                              Continue Learning
                            </Link>
                          </Button>
                        ) : (
                          <>
                            <Button 
                              className="flex-1" 
                              onClick={() => handleEnroll(course.id)}
                              disabled={enrolling[course.id]}
                            >
                              {enrolling[course.id] ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Enrolling...
                                </>
                              ) : (
                                'Enroll Now'
                              )}
                            </Button>
                            <Button variant="outline" size="icon" asChild>
                              <Link href={`/courses/${course.id}`}>
                              <BookOpen className="w-4 h-4" />
                              </Link>
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More */}
            {sortedCourses.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Courses
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
