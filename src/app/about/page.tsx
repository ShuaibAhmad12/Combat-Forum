"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Shield, Award, MapPin, Mail, Phone, Facebook, Instagram, Youtube } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

// Instructor type definition
type Instructor = {
  id: number
  name: string
  role: string
  bio: string
  experience: number
  specialties: string[]
  image: string
}

// Demo instructors data
const instructors: Instructor[] = [
  {
    id: 1,
    name: "Pawan Singh Kathait",
    role: "Head Instructor",
    bio: "Pawan Singh Kathait has been practicing martial arts for over 30 years. He specializes in traditional Kung Fu and has trained champions across the world.",
    experience: 30,
    specialties: ["Kung Fu", "Tai Chi", "Self Defense"],
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 2,
    name: "Mohd Shuaib",
    role: "Brazilian Jiu-Jitsu Coach",
    bio: "Mohd Shuaib is a 3-time national BJJ champion with a passion for teaching. She focuses on technique and practical application.",
    experience: 20,
    specialties: ["Brazilian Jiu-Jitsu", "MMA", "Grappling"],
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 3,
    name: "Shivam Dhiman",
    role: "Karate Instructor",
    bio: "Shivam Dhiman holds a 5th-degree black belt in Shotokan Karate and has been teaching for over a decade. He emphasizes discipline and form.",
    experience: 15,
    specialties: ["Karate", "Kata", "Competition"],
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 4,
    name: "Sarah Khan",
    role: "Muay Thai Coach",
    bio: "Sarah Khan is a former professional Muay Thai fighter with multiple international titles. She brings real-world experience to her teaching.",
    experience: 12,
    specialties: ["Muay Thai", "Kickboxing", "Conditioning"],
    image: "/placeholder.svg?height=400&width=400",
  },
]

// FAQ data
const faqs = [
  {
    question: "What age groups do you teach?",
    answer:
      "We offer classes for all age groups, from children as young as 5 years old to seniors. Each age group has specialized programs tailored to their physical abilities and learning pace.",
  },
  {
    question: "Do I need prior experience to join?",
    answer:
      "No prior experience is necessary! We welcome beginners and have dedicated beginner classes to help you build a strong foundation. Our instructors are experienced in guiding newcomers through the basics.",
  },
  {
    question: "How often should I attend classes?",
    answer:
      "For optimal progress, we recommend attending classes 2-3 times per week. However, this can vary based on your goals, schedule, and physical condition. Our instructors can help you create a training plan that works for you.",
  },
  {
    question: "What should I wear to my first class?",
    answer:
      "For your first class, comfortable athletic wear is sufficient. If you decide to continue, we recommend purchasing a proper gi (uniform) which can be bought through our academy or from recommended suppliers.",
  },
  {
    question: "Do you offer private lessons?",
    answer:
      "Yes, we offer private lessons for those who prefer one-on-one instruction or have specific goals they want to work on. Private lessons can be scheduled directly with our instructors based on their availability.",
  },
]

export default function AboutPage() {
  const [activeInstructor, setActiveInstructor] = useState<number>(1)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70 z-10" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center" />

        <div className="relative z-20 py-20 px-6 md:px-12 flex flex-col items-start max-w-3xl">
          <Badge className="mb-4 bg-red-500 hover:bg-red-600 text-white border-none">Est. 1999</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Martial Arts Journey</h1>
          <p className="text-lg text-slate-200 mb-8 max-w-2xl">
            For over three decades, we've been dedicated to teaching traditional and modern martial arts, fostering
            discipline, respect, and personal growth in our community.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
              Join Our Classes
            </Button>
            <Button size="lg" variant="default" className="text-white border-white hover:bg-white/10">
              Schedule a Visit
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-500" />
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 1985 by Grandmaster Wong, our academy began as a small school dedicated to preserving
                traditional martial arts techniques while adapting to modern training methodologies.
              </p>
              <p>
                What started as a single room with a handful of dedicated students has grown into one of the most
                respected martial arts academies in the region, with multiple locations and thousands of students who
                have passed through our doors.
              </p>
              <p>
                Throughout our journey, we've maintained our core philosophy: martial arts is not just about
                self-defense, but about developing character, discipline, and respect that extends to all aspects of
                life.
              </p>
              <p>
                Today, we offer a comprehensive range of martial arts styles, from traditional disciplines like Kung Fu
                and Karate to modern systems like Brazilian Jiu-Jitsu and Mixed Martial Arts.
              </p>
            </div>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="rounded-lg overflow-hidden h-64 transform translate-y-8">
              <Image
                src="/placeholder.svg?height=400&width=300"
                alt="Historical dojo photo"
                width={300}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden h-64">
              <Image
                src="/placeholder.svg?height=400&width=300"
                alt="Training session"
                width={300}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden h-64">
              <Image
                src="/placeholder.svg?height=400&width=300"
                alt="Competition team"
                width={300}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden h-64 transform translate-y--8">
              <Image
                src="/placeholder.svg?height=400&width=300"
                alt="Modern dojo"
                width={300}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="mb-20 py-16 px-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Respect",
              description: "We foster mutual respect between students, instructors, and the art itself.",
              icon: <Shield className="h-10 w-10 text-red-500" />,
            },
            {
              title: "Discipline",
              description: "We build mental fortitude and self-control through consistent practice.",
              icon: <Award className="h-10 w-10 text-red-500" />,
            },
            {
              title: "Community",
              description: "We create a supportive environment where everyone can grow together.",
              icon: <Users className="h-10 w-10 text-red-500" />,
            },
            {
              title: "Excellence",
              description: "We pursue continuous improvement in technique and character.",
              icon: <TrendingUp className="h-10 w-10 text-red-500" />,
            },
          ].map((value, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-red-50 dark:bg-red-950/50 p-4 w-fit mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Instructors Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Instructors</h2>

        <Tabs defaultValue="gallery" className="w-full mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="gallery">Gallery View</TabsTrigger>
            <TabsTrigger value="detail">Detailed View</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {instructors.map((instructor) => (
                <Card
                  key={instructor.id}
                  className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer border-2 ${
                    activeInstructor === instructor.id ? "border-red-500 dark:border-red-400" : "border-transparent"
                  }`}
                  onClick={() => setActiveInstructor(instructor.id)}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={instructor.image || "/placeholder.svg"}
                      alt={instructor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{instructor.name}</h3>
                    <p className="text-sm text-muted-foreground">{instructor.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="detail" className="mt-6">
            {instructors.map((instructor) => (
              <div
                key={instructor.id}
                className={`mb-6 p-6 rounded-lg border-2 transition-all ${
                  activeInstructor === instructor.id
                    ? "border-red-500 dark:border-red-400 bg-slate-50 dark:bg-slate-900/50"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex-shrink-0">
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src={instructor.image || "/placeholder.svg"}
                        alt={instructor.name}
                        width={300}
                        height={300}
                        className="w-full aspect-square object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-2xl font-bold mb-2">{instructor.name}</h3>
                    <p className="text-lg text-muted-foreground mb-4">{instructor.role}</p>
                    <p className="mb-4">{instructor.bio}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-semibold">Experience:</span>
                      <span>{instructor.experience} years</span>
                    </div>
                    <div>
                      <span className="font-semibold block mb-2">Specialties:</span>
                      <div className="flex flex-wrap gap-2">
                        {instructor.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </section>

      {/* FAQ Section */}
      <section className="mb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section className="rounded-2xl overflow-hidden">
        <div className="bg-slate-900 text-white py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Visit Our Dojo</h2>
                <p className="mb-8 text-slate-300">
                  We welcome visitors to observe classes and experience our training environment. Feel free to stop by
                  during our operating hours or contact us to schedule a visit.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-400 mt-1" />
                    <div>
                      <p className="font-medium">Muzaffarnagar</p>
                      <p className="text-slate-300">123 Civil Lines, ST 12345</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-red-400 mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-slate-300">+91 7533998861</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-red-400 mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-slate-300">shuaib.ahmad@kruxxtech.com</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-red-500 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-red-500 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-red-500 transition-colors">
                    <Youtube className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6">Operating Hours</h3>
                <div className="space-y-3 mb-8">
                  {[
                    { day: "Monday - Friday", hours: "6:00 AM - 9:00 PM" },
                    { day: "Saturday", hours: "8:00 AM - 6:00 PM" },
                    { day: "Sunday", hours: "10:00 AM - 4:00 PM" },
                  ].map((schedule, index) => (
                    <div key={index} className="flex justify-between pb-2 border-b border-slate-700">
                      <span className="font-medium">{schedule.day}</span>
                      <span className="text-slate-300">{schedule.hours}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Ready to Begin Your Journey?</h3>
                  <p className="mb-6 text-slate-300">
                    Take the first step toward mastering martial arts and transforming your life.
                  </p>
                  <Button size="lg" className="w-full bg-red-500 hover:bg-red-600 text-white">
                    Schedule a Free Trial Class
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Import the Users component that was missing
function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

// Import the TrendingUp component that was missing
function TrendingUp({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

