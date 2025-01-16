'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge as BadgetSCN } from "@/components/ui/badge"
import { EyeIcon, PencilIcon, TrashIcon, BookOpenIcon, Calendar } from "lucide-react";

import Link from "next/link";
import { Question } from "@/types/question";
import Badge from "./Badge";

export default function QuestionCard({ question }: { question: Question }) {

  console.log(question);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="overflow-hidden bg-white/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 truncate">
              {(question.topics)[0]}
            </h2>
            <BadgetSCN className="bg-blue-500 text-white text-xs sm:text-sm min-w-20">
              Grado: {question.grade}
            </BadgetSCN>
          </div>
          <div className="flex items-center mt-2 text-xs sm:text-sm text-gray-600">
            <BookOpenIcon className="w-4 h-4 mr-1 self-start" />
            {question.topics.join(", ")}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {question.data.statement.length > 100
              ? `${question.data.statement.substring(0, 100)}...`
              : question.data.statement}
          </p>
        </CardContent>
        <CardFooter className="bg-gray-50 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs sm:text-sm">
            <Calendar className="w-4 h-4" />
            <time dateTime={question.lastModified}>
              {new Date(question.lastModified).toLocaleDateString()}
            </time>
          </div>
          <div className="flex space-x-1">
            <Link href={`${question.courseId}/question/${question.id}/preview`} className="no-underline text-current" passHref>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <EyeIcon className="h-4 w-4" />
                <span className="sr-only">Vista previa</span>
              </Button>
            </Link>
            <Link href={`${question.courseId}/question/${question.id}/edit`} className="no-underline text-current" passHref>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <PencilIcon className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
            </Link>
          </div>
        </CardFooter>
        <div className="p-4 flex flex-wrap justify-center">
          {question.learningStylesIds.map((id) => (
            <Badge key={id} learningStyleid={id} />
          ))}
        </div>
      </Card>
    </motion.div>
);}
