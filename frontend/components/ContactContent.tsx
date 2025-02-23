// "use client"

// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Mail, Phone, MapPin } from "lucide-react"

// export default function ContactContent() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="w-full max-w-4xl mx-auto"
//     >
//       <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="space-y-6">
//           <h2 className="text-2xl font-semibold">Get in Touch</h2>
//           <p className="text-gray-600">
//             We'd love to hear from you. Please fill out this form or use our contact information below.
//           </p>
//           <form className="space-y-4">
//             <Input placeholder="Your Name" />
//             <Input type="email" placeholder="Your Email" />
//             <Textarea placeholder="Your Message" />
//             <Button type="submit">Send Message</Button>
//           </form>
//         </div>
//         <div className="space-y-6">
//           <h2 className="text-2xl font-semibold">Contact Information</h2>
//           <div className="space-y-4">
//             <div className="flex items-center space-x-3">
//               <Mail className="text-gray-600" />
//               <span>davidmrdev@gmail.com</span>
//             </div>
//             <div className="flex items-center space-x-3">
//               <Mail className="text-gray-600" />
//               <span>support@ai-knows.me</span>
//             </div>
//             <div className="flex items-center space-x-3">
//               <Phone className="text-gray-600" />
//               <span>+1 (555) 123-4567</span>
//             </div>
//             <div className="flex items-center space-x-3">
//               <MapPin className="text-gray-600" />
//               <span>123 AI Street, Tech City, TC 12345</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

