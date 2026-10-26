/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import Modal from "../../../Reusable/Modal/Modal";
import Button from "../../../Reusable/Button/Button";
import { useUpdateApplicationMutation } from "../../../../redux/Features/Application/applicationApi";
import toast from "react-hot-toast";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  currentRating?: number;
  candidateName?: string;
  applicationId: string
};

const ChangeRatingModal = ({
  isModalOpen,
  setIsModalOpen,
  currentRating = 0,
  candidateName = "this candidate",
  applicationId
}: Props) => {
  const [rating, setRating] = useState<number>(currentRating);
  const [updateApplication, {isLoading}] = useUpdateApplicationMutation();

  // Re-sync when the modal opens with a new candidate
  useEffect(() => {
    if (isModalOpen) setRating(currentRating);
  }, [isModalOpen, currentRating]);

  const handleSave = async () => {
    try {
      const payload = {
        resumeRating: rating
      }
      const response =await updateApplication({ id:applicationId, data: payload }).unwrap();
      if (response?.success) {
        setIsModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handleReset = () => setRating(currentRating);

  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      heading="Rate Resume"
      description={`Give an initial rating for ${candidateName}'s resume.`}
    >
      <div className="font-Montserrat flex flex-col gap-6 pt-2">
        {/* ---------- Rating display ---------- */}
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <div className="relative flex items-center justify-center">
            {/* Glow ring */}
            <div className="absolute w-24 h-24 rounded-full bg-primary-10/10 blur-2xl" />
            <FiStar
              className="relative text-yellow-500 drop-shadow-sm"
              size={48}
            />
          </div>

          <div className="flex items-end gap-1 mt-2">
            <span className="text-5xl font-bold text-neutral-40 leading-none tabular-nums">
              {rating}
            </span>
            <span className="text-lg text-neutral-65 pb-1">/ 10</span>
          </div>

          <p className="text-sm text-neutral-65">
            {rating >= 8
              ? "Excellent match"
              : rating >= 6
                ? "Good match"
                : rating >= 4
                  ? "Average match"
                  : rating === 0
                    ? "Not rated yet"
                    : "Needs review"}
          </p>
        </div>

        {/* ---------- Slider ---------- */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-neutral-40">
              Adjust rating
            </label>
            <span className="text-xs text-neutral-65">0 – 10</span>
          </div>

          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer
                       bg-neutral-105
                       accent-primary-10
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-5
                       [&::-webkit-slider-thumb]:h-5
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-primary-10
                       [&::-webkit-slider-thumb]:shadow-md
                       [&::-webkit-slider-thumb]:cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-neutral-65 mt-1 px-0.5">
            <span>0</span>
            <span>2</span>
            <span>4</span>
            <span>6</span>
            <span>8</span>
            <span>10</span>
          </div>
        </div>

        {/* ---------- Quick picks ---------- */}
        <div>
          <p className="text-sm font-medium text-neutral-40 mb-2">Quick pick</p>
          <div className="grid grid-cols-6 gap-2">
            {[0, 2, 4, 6, 8, 10].map((n) => {
              const active = rating === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`py-2 rounded-lg text-sm font-medium border transition-all
                    ${
                      active
                        ? "bg-primary-10 text-white border-primary-10 shadow-sm scale-[1.03]"
                        : "bg-white text-neutral-40 border-neutral-98 hover:border-primary-10 hover:text-primary-10"
                    }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------- Footer ---------- */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-neutral-98">
          <button
            type="button"
            onClick={handleReset}
            disabled={rating === currentRating}
            className="text-sm text-neutral-65 hover:text-neutral-40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              label="Cancel"
              type="button"
              classNames="py-2 px-3"
              onClick={() => setIsModalOpen(false)}
            />
            <Button
              variant="primary"
              label="Change Status"
              type="submit"
              classNames="py-2 px-3"
              onClick={handleSave}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeRatingModal;
