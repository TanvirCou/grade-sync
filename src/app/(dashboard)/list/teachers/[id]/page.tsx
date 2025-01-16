import Announcements from '@/components/Announcements/Announcements';
import BigCalendar from '@/components/Calendar/BigCalendar';
import PerformanceChart from '@/components/Chart/PerformanceChart';
import UpdateModal from '@/components/Form/UpdateModal';
import Image from 'next/image';
import React from 'react';

const SingleTeacherPage = () => {
  return (
    <div className="flex flex-col gap-2 p-2 xl:flex-row">
      <div className="w-full xl:w-2/3">
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="flex w-full items-center gap-2 rounded-md bg-sky-200 px-2 py-3 md:gap-0 lg:w-1/2 xl:gap-2">
            <div className="flex w-1/3 items-center justify-center">
              <Image
                src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt=""
                width={50}
                height={50}
                className="h-28 w-28 rounded-full object-cover"
              />
            </div>
            <div className="flex w-2/3 flex-col gap-3">
              <div className="flex items-center gap-2">
                <p className="text-md font-medium">Leonard Snyder</p>
                <UpdateModal
                  table="teacher"
                  data={{
                    id: 1,
                    username: 'deanguerrero',
                    email: 'deanguerrero@gmail.com',
                    password: 'password',
                    firstName: 'Dean',
                    lastName: 'Guerrero',
                    phone: '+1 234 567 89',
                    address: '1234 Main St, Anytown, USA',
                    bloodType: 'A+',
                    birthday: '2000-01-01',
                    sex: 'male',
                    img: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200',
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </p>

              <div className="flex flex-col md:flex-row md:gap-x-20 lg:flex-col lg:gap-x-0 xl:flex-row xl:items-center xl:justify-between xl:gap-x-0">
                <div>
                  <div className="flex items-center gap-1">
                    <Image src="/blood.png" alt="" width={12} height={12} />
                    <p className="text-xs">O+</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Image src="/date.png" alt="" width={12} height={12} />
                    <p className="text-xs">January 2025</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Image src="/mail.png" alt="" width={12} height={12} />
                    <span className="text-xs">user@gmail.com</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Image src="/phone.png" alt="" width={12} height={12} />
                    <span className="text-xs">+1 234 567</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-1 lg:w-[49%]">
            <div className="flex flex-col items-center gap-1 md:flex-row">
              <div className="flex w-full items-center justify-center gap-4 rounded-md bg-white py-3 md:flex-1">
                <Image
                  src="/singleAttendance.png"
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <div>
                  <h1 className="text-xl font-semibold">90%</h1>
                  <span className="text-sm text-gray-400">Attendance</span>
                </div>
              </div>

              <div className="flex w-full items-center justify-center gap-4 rounded-md bg-white py-3 md:flex-1">
                <Image
                  src="/singleBranch.png"
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <div>
                  <h1 className="text-xl font-semibold">2</h1>
                  <span className="text-sm text-gray-400">Branches</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 md:flex-row">
              <div className="flex w-full items-center justify-center gap-4 rounded-md bg-white py-3 md:flex-1">
                <Image
                  src="/singleLesson.png"
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <div>
                  <h1 className="text-xl font-semibold">6</h1>
                  <span className="text-sm text-gray-400">Lessons</span>
                </div>
              </div>

              <div className="flex w-full items-center justify-center gap-4 rounded-md bg-white py-3 md:flex-1">
                <Image
                  src="/singleClass.png"
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <div>
                  <h1 className="text-xl font-semibold">6</h1>
                  <span className="text-sm text-gray-400">Classes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 h-[900px] rounded-md bg-white p-2">
          <p className="px-1 text-lg font-semibold">Teacher&apos;s Schedule</p>
          <BigCalendar />
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 xl:w-1/3">
        <div className="rounded-md bg-white px-4 py-3">
          <p className="text-lg font-medium">Shortcuts</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
            <p className="rounded-md bg-sky-100 p-2">Teacher&apos;s Classes</p>
            <p className="rounded-md bg-purple-100 p-2">
              Teacher&apos;s Students
            </p>
            <p className="rounded-md bg-yellow-100 p-2">
              Teacher&apos;s Lessons
            </p>
            <p className="rounded-md bg-pink-100 p-2">
              Teacher&apos;s Assignments
            </p>
            <p className="rounded-md bg-teal-100 p-2">Teacher&apos;s Exams</p>
          </div>
        </div>

        <div className="h-[300px]">
          <PerformanceChart />
        </div>

        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
