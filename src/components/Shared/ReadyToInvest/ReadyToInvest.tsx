import { useForm } from "react-hook-form";
import Container from "../../Reusable/Container/Container";
import SectionTitle from "../../Reusable/Heading/Heading";
import TextInput from "../../Reusable/TextInput/TextInput";
import Button from "../../Reusable/Button/Button";
type FormData = {
  fullName: string;
  email: string;
};
const ReadyToInvest = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="bg-gradient-course pt-[60px] font-Montserrat">
      <Container>
        <SectionTitle
          heading="Ready to learn or invest the right way?"
          subHeading="Start with our free newsletter or explore the course library today."
        />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 flex flex-col items-center ">
          <div className="flex flex-col md:flex-row justify-between gap-13 w-full">
            <TextInput
              label="Name"
              placeholder="For e.g., Mohit Naroune"
              error={errors.fullName}
              {...register("fullName", {
                required: "Full name is required",
              })}
            />

            <TextInput
              label="Email"
              type="email"
              placeholder="you@email.com"
              error={errors.email}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format",
                },
              })}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            label="Subscribe For Free!"
            classNames=" w-full md:w-md px-32"
          />
        </form>
      </Container>
      <div className="bg-gradient-course-blur h-[133px] w-full"></div>
    </div>
  );
};

export default ReadyToInvest;
