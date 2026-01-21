import { motion } from 'framer-motion';

const ProgressBar = ({ currentStep, totalSteps }) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full relative py-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-blue-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium text-gray-500">
                <span>Account</span>
                <span>Store</span>
                <span>Verification</span>
            </div>
        </div>
    );
};

export default ProgressBar;
