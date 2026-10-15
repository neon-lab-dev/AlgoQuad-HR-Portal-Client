/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { TiArrowLeft } from "react-icons/ti";
import { useEffect } from "react";
import { useCreateExamMutation, useGetAllQuestionsOfCourseQuery, useUpdateExamMutation } from "../../../redux/Features/Course/courseApi";
import toast from "react-hot-toast";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import Button from "../../../components/Reusable/Button/Button";

type Question = {
  questionText: string;
  option1: string;
  option2: string;
  option3?: string;
  option4?: string;
  correctAnswerIndex: number | string;
};

type FormValues = {
  title: string;
  questions: Question[];
};

const ManageExam = () => {
  const { courseId } = useParams();
  const { data, isLoading } = useGetAllQuestionsOfCourseQuery(courseId);
  const [createExam, { isLoading: isQuestionAdding }] =
    useCreateExamMutation();
  const [updateExam, { isLoading: isQuestionUpdating }] =
    useUpdateExamMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      questions: [
        {
          questionText: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correctAnswerIndex: "",
        },
      ],
    },
  });

useEffect(() => {
  if (data?.data?._id) {
    const mappedQuestions = data.data.questions.map((q: any) => ({
      questionText: q.questionText,
      option1: q.options?.[0]?.text || "",
      option2: q.options?.[1]?.text || "",
      option3: q.options?.[2]?.text || "",
      option4: q.options?.[3]?.text || "",
      correctAnswerIndex: q.correctAnswerIndex ?? 0,
    }));

    reset({
      title: data.data.title,
      questions: mappedQuestions,
    });
  }
}, [data, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const handleAddQuestion = async (formData: FormValues) => {
    try {
      const questions = formData.questions.map((q: any) => {
        return {
          questionText: q.questionText,
          options: [
            { text: q.option1 },
            { text: q.option2 },
            { text: q.option3 },
            { text: q.option4 },
          ],
          correctAnswerIndex: parseInt(q.correctAnswerIndex),
        };
      });

      const payload = {
        courseId,
        title: formData.title,
        questions,
      };

      if (data?.data?._id) {
        // 🛠 UPDATE
        const response = await updateExam({
          data: payload,
          examId: data?.data?._id,
        }).unwrap();

        toast.success(response?.message || "Exam updated!");
      } else {
        // 🛠 CREATE
        const response = await createExam(payload).unwrap();
        toast.success(response?.message || "Exam created!");
      }

      reset();
    } catch (err: any) {
      console.error("Error saving exam:", err);
      toast.error(err?.message || "Failed to save exam");
    }
  };

  const handleCorrectAnswerChange = (questionIndex: number, optionIndex: number) => {
    setValue(`questions.${questionIndex}.correctAnswerIndex`, optionIndex);
  };

  useEffect(() => {
    if (data?.exam) {
      const exam = data.exam;

      const defaultValues = {
        title: exam.title || "",
        questions: exam.questions.map((q: any) => ({
          questionText: q.questionText,
          option1: q.options[0]?.text || "",
          option2: q.options[1]?.text || "",
          option3: q.options[2]?.text || "",
          option4: q.options[3]?.text || "",
          correctAnswerIndex: q.correctAnswerIndex,
        })),
      };

      reset(defaultValues);
    }
  }, [data, reset]);

  return (
    <div>
      <div className="flex justify-between items-center lg:w-[80%] w-full mx-auto">
        <div className="flex items-center gap-2">
          <Link to={"/dashboard/admin/courses"}>
            <TiArrowLeft className="text-3xl" />
          </Link>
          <h1 className="text-[#0F172A] font-Inter font-semibold leading-7 tracking-tighter text-2xl">
            Add Exam Questions
          </h1>
        </div>
        <Link
          to={"/dashboard/admin/courses"}
          className="px-4 py-2 bg-primary-10 rounded-lg text-white"
        >
          Save
        </Link>
      </div>
      <div className="flex flex-col lg:w-[80%] w-full p-6 bg-white gap-6 rounded-2xl mx-auto mt-5">
        {isLoading ? (
          <div className="flex flex-col gap-2 items-center justify-center mt-10">
            <div className="size-10 border-4 border-primary-10 border-t-transparent rounded-full animate-spin" />
            <p>Loading...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(handleAddQuestion)}
            className="flex flex-col gap-4 w-full"
          >
            <TextInput
              label="Exam Name/Title"
              placeholder="Enter exam name"
              {...register("title", { required: "Exam title is required" })}
              error={errors.title}
            />

            {fields.map((field, questionIndex) => (
              <div
                key={field.id}
                className="bg-neutral-90/30 p-5 pt-8 rounded-2xl flex flex-col gap-4 relative"
              >
                <TextInput
                  label={`Question ${questionIndex + 1}`}
                  placeholder="Enter question text"
                  {...register(`questions.${questionIndex}.questionText`, {
                    required: "Question text is required",
                  })}
                  error={(errors.questions as any)?.[questionIndex]?.questionText}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((opt) => (
                    <div key={opt} className="flex items-center gap-2">
                      <TextInput
                        label={`Option ${opt}`}
                        placeholder={`Enter option ${opt}`}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        {...register(`questions.${questionIndex}.option${opt}`, {
                          required: `Option ${opt} is required`,
                        })}
                        error={
                          (errors.questions as any)?.[questionIndex]?.[`option${opt}`]
                        }
                      />
                      <input
                        type="radio"
                        name={`correctAnswer-${questionIndex}`}
                        checked={
  watch(`questions.${questionIndex}.correctAnswerIndex`) === (opt - 1)
}
                        onChange={() => handleCorrectAnswerChange(questionIndex, opt - 1)}
                        className="h-5 w-5"
                      />
                      <span>Correct</span>
                    </div>
                  ))}
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(questionIndex)}
                    className="text-red-600 text-sm underline self-end absolute top-1 right-6 cursor-pointer"
                  >
                    Remove Question
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                append({
                  questionText: "",
                  option1: "",
                  option2: "",
                  option3: "",
                  option4: "",
                  correctAnswerIndex: "",
                })
              }
              className="text-primary-10 text-sm font-medium italic hover:underline w-fit cursor-pointer"
            >
              + Add another question
            </button>

            <div className="flex items-center justify-end gap-[10px] mt-4">
              <Link to={"/dashboard/admin/courses"}><Button type="submit" label="Cancel" /></Link>
              <Button type="submit" variant="primary" label={isQuestionAdding || isQuestionUpdating  ? "Submitting" : "Submit"} isLoading={isQuestionAdding || isQuestionUpdating} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ManageExam;