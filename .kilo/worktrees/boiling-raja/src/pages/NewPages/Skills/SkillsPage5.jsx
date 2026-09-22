import { Icon } from '@iconify/react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAssemblyTranscription } from '../../../components/ThirdParty/AssemblyAI';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import images from '../../../utils/images';
import CourseChatBotAi from '../AssessmentAssistancePage/CourseChatBotAi';

const SkillsPage5 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { goal = '' } = user || {};
  const { id, courseId, subjectId, subSubjectId, chapterId } = useParams();
  const [activeTab, setActiveTab] = useState('Summary');
  const [courseData, setCourseData] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [videoDuration, setVideoDuration] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const videoRef = useRef(null);
  const captionsTrackRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const currentIndexRef = useRef(-1);
  const [vttUrl, setVttUrl] = useState(null);
  const [generatedQuestionsAndAnswers, setGeneratedQuestionsAndAnswers] = useState([]);
  const [evaluations, setEvaluations] = useState({});
  const [importantHeadings, setImportantHeadings] = useState([]);

  const [nextVideo, setNextVideo] = useState(null);
  const [nextOverlayVisible, setNextOverlayVisible] = useState(false);
  const [nextOverlayCountdown, setNextOverlayCountdown] = useState(0);
  const [autoPlayNext, setAutoPlayNext] = useState(false);

  const { transcribe, status, summary, transcriptText, error, wordSegments } =
    useAssemblyTranscription();

  const OPENAI_KEY =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENAI_KEY) ||
    process.env.REACT_APP_OPENAI_KEY ||
    '';

  const overlayThresholdSeconds = 8;
  const countdownStart = overlayThresholdSeconds;

  const findNextVideoInCourse = (currentVidId, course) => {
    if (!course || !Array.isArray(course.subjects)) return null;
    for (const subjectWrapper of course.subjects) {
      const subSubjects = subjectWrapper.subSubjects || [];
      for (const ss of subSubjects) {
        const chapters = ss.chapters || [];
        for (const ch of chapters) {
          const topics = ch.topics || [];
          for (const t of topics) {
            const videos = t.courseVideos || [];
            for (let i = 0; i < videos.length; i++) {
              const v = videos[i];
              if (v._id === currentVidId) {
                if (i + 1 < videos.length) return videos[i + 1];
                const topicIndex = topics.indexOf(t);
                if (topicIndex + 1 < topics.length) {
                  const nextTopicVideos = topics[topicIndex + 1].courseVideos || [];
                  if (nextTopicVideos.length) return nextTopicVideos[0];
                }
                const chapterIndex = chapters.indexOf(ch);
                if (chapterIndex + 1 < chapters.length) {
                  const nextChapterTopics = chapters[chapterIndex + 1].topics || [];
                  if (nextChapterTopics.length) {
                    const firstTopicVideos = nextChapterTopics[0].courseVideos || [];
                    if (firstTopicVideos.length) return firstTopicVideos[0];
                  }
                }
                const subIndex = subSubjects.indexOf(ss);
                if (subIndex + 1 < subSubjects.length) {
                  const nextSubChapters = subSubjects[subIndex + 1].chapters || [];
                  if (nextSubChapters.length) {
                    const firstTopicVideos = nextSubChapters[0].topics?.[0]?.courseVideos || [];
                    if (firstTopicVideos && firstTopicVideos.length) return firstTopicVideos[0];
                  }
                }
                const subjectIndex = course.subjects.indexOf(subjectWrapper);
                if (subjectIndex + 1 < course.subjects.length) {
                  const nextSubSubjects = course.subjects[subjectIndex + 1].subSubjects || [];
                  if (nextSubSubjects.length) {
                    const nextChapters = nextSubSubjects[0].chapters || [];
                    if (nextChapters.length) {
                      const firstTopics = nextChapters[0].topics || [];
                      if (firstTopics.length) {
                        const firstVideos = firstTopics[0].courseVideos || [];
                        if (firstVideos.length) return firstVideos[0];
                      }
                    }
                  }
                }
                return null;
              }
            }
          }
        }
      }
    }
    return null;
  };

  const generateQuestion = async ({
    description,
    setGeneratedQuestionsAndAnswers,
    maxQuestions = 3,
  }) => {
    if (!description || !description.trim()) {
      setGeneratedQuestionsAndAnswers([]);
      return;
    }
    if (!OPENAI_KEY) {
      setGeneratedQuestionsAndAnswers([]);
      return;
    }
    const systemPrompt =
      'You are an educational assistant that creates concise, clear assessment questions (short-answer or conceptual) and model answers from a given video transcript. Output must be a single valid JSON array of objects with the keys: question, answer, hint. Provide up to the requested number of Q&A pairs. Keep each question short (one sentence) and answers concise (one or two sentences).';
    const userPrompt = `Transcript:\n\n${description}\n\nReturn up to ${maxQuestions} items as JSON array like [{"question":"...","answer":"...","hint":"..."}]`;
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-5',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });
      if (!res.ok) {
        setGeneratedQuestionsAndAnswers([]);
        return;
      }
      const data = await res.json();
      let text = data?.choices?.[0]?.message?.content || '';
      text = text.trim();
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        const jsonMatch = text.match(/(\[.*\]|\{.*\})/s);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[1]);
          } catch (e2) {
            parsed = null;
          }
        }
      }
      if (!Array.isArray(parsed)) {
        const lines = text
          .split('\n')
          .map(l => l.trim())
          .filter(Boolean);
        const items = [];
        for (let i = 0; i < lines.length && items.length < maxQuestions; i++) {
          const line = lines[i];
          const qMatch = line.match(/^\d+\.\s*(.*)/) || line.match(/^Q[:\-\s]*(.*)/i);
          if (qMatch) {
            const question = qMatch[1];
            const answerLine = lines[i + 1] || '';
            const hintLine = lines[i + 2] || '';
            items.push({
              question: question,
              answer: answerLine.replace(/^Answer[:\-\s]*/i, '').trim() || '',
              hint: hintLine.replace(/^Hint[:\-\s]*/i, '').trim() || '',
            });
            i += 2;
          }
        }
        if (items.length) parsed = items;
      }
      if (Array.isArray(parsed)) {
        const normalized = parsed
          .slice(0, maxQuestions)
          .map(p => ({
            question: (p.question || p.q || '').toString().trim(),
            answer: (p.answer || p.a || '').toString().trim(),
            hint: (p.hint || p.h || '').toString().trim(),
          }))
          .filter(p => p.question && p.answer);
        setGeneratedQuestionsAndAnswers(normalized);
        setEvaluations({});
      } else {
        setGeneratedQuestionsAndAnswers([]);
      }
    } catch (err) {
      setGeneratedQuestionsAndAnswers([]);
    }
  };

  const generateImportantHeadings = async ({ description, maxItems = 8 }) => {
    if (!description || !description.trim()) {
      setImportantHeadings([]);
      return;
    }
    if (!OPENAI_KEY) {
      setImportantHeadings([]);
      return;
    }
    const systemPrompt =
      'You are a content analyst. From a lecture transcript, extract a concise, ordered list of the most important section headings with approximate start times in the video. Return a single JSON array with objects: {"title": string, "time": number}. The "time" must be the start time in seconds (integer). Limit to the requested count. Titles should be short and descriptive.';
    const userPrompt = `Transcript:\n\n${description}\n\nReturn up to ${maxItems} items strictly as JSON array, e.g. [{"title":"Introduction","time":0},{"title":"Key Concept","time":185}]`;
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-5',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.2,
        }),
      });
      if (!res.ok) {
        setImportantHeadings([]);
        return;
      }
      const data = await res.json();
      let text = data?.choices?.[0]?.message?.content || '';
      text = text.trim();
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        const jsonMatch = text.match(/\[.*\]/s);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch {
            parsed = null;
          }
        }
      }
      if (Array.isArray(parsed)) {
        const normalized = parsed
          .slice(0, maxItems)
          .map(p => ({
            title: (p.title || '').toString().trim(),
            time: Number.isFinite(p.time) ? Math.max(0, Math.floor(p.time)) : 0,
          }))
          .filter(p => p.title);
        setImportantHeadings(normalized);
      } else {
        setImportantHeadings([]);
      }
    } catch {
      setImportantHeadings([]);
    }
  };

  useEffect(() => {
    generateQuestion({
      description: transcriptText,
      setGeneratedQuestionsAndAnswers,
    });
  }, [transcriptText]);

  useEffect(() => {
    generateImportantHeadings({
      description: transcriptText,
    });
  }, [transcriptText]);

  const handleLoadedMetadata = e => {
    const durationInSeconds = e.target.duration;
    const formatted = formatDuration(durationInSeconds);
    setVideoDuration(formatted);
    if (autoPlayNext) {
      try {
        e.target.play();
      } catch (e) {}
      setAutoPlayNext(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (goal) {
      fetchCourseData();
      // fetchRelatedCourses();
    }
  }, [isAuthenticated, goal]);

  const fetchCourseData = () => {
    userApi.courses.getById({
      params: { courseId, CourseType: id, subjectId, page: 1, limit: 9999 },
      setIsLoading,
      onSuccess: res => {
        const fetchedData = res?.data || [];
        setCourseData(fetchedData[0]);
        setIsPurchased(true || fetchedData[0]?.isPurchased);
        setIsLoading(false);
      },
      onError: err => {
        setIsLoading(false);
      },
    });
  };

  const fetchChatMessages = topic => {
    userApi.courses.getQA({
      id: topic,
      onSuccess: res => {
        const fetchedData = res?.data || [];
        setChatMessages(fetchedData);
        setIsLoading(false);
      },
      onError: () => {
        setChatMessages([]);
      },
    });
  };

  useEffect(() => {
    if (selectedVideo?.topic?._id) {
      fetchChatMessages(selectedVideo?.topic?._id);
    }
  }, [selectedVideo]);

  useEffect(() => {
    if (courseData && location.search) {
      const queryParams = new URLSearchParams(location.search);
      const topicId = queryParams.get('topicId');
      const videoId = queryParams.get('videoId');
      const subSubject = courseData.subjects
        .flatMap(subject => subject.subSubjects)
        .find(sub => sub._id === subSubjectId);
      if (subSubject) {
        const chapter = subSubject.chapters.find(chap => chap._id === chapterId);
        if (chapter) {
          const topic = chapter.topics.find(t => t._id === topicId);
          if (topic) {
            const video = topic.courseVideos.find(v => v._id === videoId);
            setSelectedVideo(video);
          }
        }
      }
    }
  }, [courseData, location.search]);

  useEffect(() => {
    if (selectedVideo && courseData) {
      const nv = findNextVideoInCourse(selectedVideo._id, courseData);
      setNextVideo(nv);
      setNextOverlayVisible(false);
      setNextOverlayCountdown(0);
      setAutoPlayNext(false);
    }
  }, [selectedVideo, courseData]);

  useEffect(() => {
    if (selectedVideo?.videoLink && status === 'idle' && !transcriptText && !summary) {
      transcribe(selectedVideo.videoLink);
    }
  }, [selectedVideo, status, transcriptText, summary]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const findIndexByTime = timeMs => {
      if (!wordSegments?.length) return -1;
      let lo = 0;
      let hi = wordSegments.length - 1;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const w = wordSegments[mid];
        if (timeMs < w.start) {
          hi = mid - 1;
        } else if (timeMs > w.end) {
          lo = mid + 1;
        } else {
          return mid;
        }
      }
      return -1;
    };

    let overlayInterval = null;

    const handleTimeUpdate = () => {
      const currentTimeMs = (video.currentTime || 0) * 1000;
      const prevIdx = currentIndexRef.current;
      if (
        prevIdx >= 0 &&
        prevIdx < (wordSegments?.length || 0) &&
        currentTimeMs >= wordSegments[prevIdx].start &&
        currentTimeMs <= wordSegments[prevIdx].end
      ) {
        // wordSegments progress handled
      } else {
        const idx = findIndexByTime(currentTimeMs);
        if (idx !== -1 && idx !== prevIdx) {
          currentIndexRef.current = idx;
          setCurrentIndex(idx);
        } else if (idx === -1 && prevIdx !== -1) {
          currentIndexRef.current = -1;
          setCurrentIndex(-1);
        }
      }

      const duration = video.duration || 0;
      const remaining = Number.isFinite(duration)
        ? Math.max(0, duration - (video.currentTime || 0))
        : Infinity;
      if (nextVideo && remaining <= overlayThresholdSeconds && !nextOverlayVisible) {
        setNextOverlayVisible(true);
        setNextOverlayCountdown(countdownStart);
        overlayInterval = setInterval(() => {
          setNextOverlayCountdown(prev => {
            if (prev <= 1) {
              clearInterval(overlayInterval);
              overlayInterval = null;
              playNextVideoAutomatically();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate, { passive: true });
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      if (overlayInterval) {
        clearInterval(overlayInterval);
        overlayInterval = null;
      }
    };
  }, [wordSegments, nextVideo, nextOverlayVisible]);

  useEffect(() => {
    if (!wordSegments || !wordSegments.length) {
      if (vttUrl) {
        URL.revokeObjectURL(vttUrl);
        setVttUrl(null);
      }
      return;
    }
    const formatTimestamp = ms => {
      const totalSeconds = ms / 1000;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const milliseconds = Math.floor(ms % 1000);
      const hh = String(hours).padStart(2, '0');
      const mm = String(minutes).padStart(2, '0');
      const ss = String(seconds).padStart(2, '0');
      const mmm = String(milliseconds).padStart(3, '0');
      return `${hh}:${mm}:${ss}.${mmm}`;
    };
    const cues = [];
    const mergeWindowMs = 200;
    let cueStart = wordSegments[0].start;
    let cueEnd = wordSegments[0].end;
    let cueText = wordSegments[0].text;
    for (let i = 1; i < wordSegments.length; i++) {
      const w = wordSegments[i];
      if (w.start - cueEnd <= mergeWindowMs) {
        cueEnd = w.end;
        cueText = `${cueText} ${w.text}`;
      } else {
        cues.push({ start: cueStart, end: cueEnd, text: cueText.trim() });
        cueStart = w.start;
        cueEnd = w.end;
        cueText = w.text;
      }
    }
    cues.push({ start: cueStart, end: cueEnd, text: cueText.trim() });
    const vttLines = ['WEBVTT\n\n'];
    cues.forEach((c, i) => {
      vttLines.push(`${i + 1}`);
      vttLines.push(`${formatTimestamp(c.start)} --> ${formatTimestamp(c.end)}`);
      vttLines.push(c.text);
      vttLines.push('\n');
    });
    const vttBlob = new Blob([vttLines.join('\n')], { type: 'text/vtt' });
    const url = URL.createObjectURL(vttBlob);
    if (vttUrl) {
      URL.revokeObjectURL(vttUrl);
    }
    setVttUrl(url);
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [wordSegments]);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    let trackEl = captionsTrackRef.current;
    if (trackEl && trackEl.parentElement !== video) {
      trackEl = null;
      captionsTrackRef.current = null;
    }
    if (vttUrl && !trackEl) {
      trackEl = document.createElement('track');
      trackEl.kind = 'captions';
      trackEl.src = vttUrl;
      trackEl.srclang = 'en';
      trackEl.label = 'English';
      trackEl.default = false;
      video.appendChild(trackEl);
      captionsTrackRef.current = trackEl;
      trackEl.addEventListener('load', () => {
        try {
          trackEl.track.mode = showCaptions ? 'showing' : 'hidden';
        } catch (e) {}
      });
    }
    if (trackEl) {
      try {
        trackEl.track.mode = showCaptions ? 'showing' : 'hidden';
      } catch (e) {}
    }
  }, [vttUrl, showCaptions]);

  const formatDuration = seconds => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s].map(val => (val < 10 ? `0${val}` : val)).join(':');
  };

  const parseTimestampToSeconds = t => {
    if (t == null) return 0;
    if (typeof t === 'number') return t;
    if (typeof t === 'string') {
      const parts = t
        .split(':')
        .map(p => p.trim())
        .filter(Boolean);
      if (parts.length === 1) {
        const n = Number(parts[0]);
        return Number.isFinite(n) ? n : 0;
      }
      if (parts.length === 2) {
        const m = Number(parts[0]);
        const s = Number(parts[1]);
        return (Number.isFinite(m) ? m : 0) * 60 + (Number.isFinite(s) ? s : 0);
      }
      if (parts.length === 3) {
        const h = Number(parts[0]);
        const m = Number(parts[1]);
        const s = Number(parts[2]);
        return (
          (Number.isFinite(h) ? h : 0) * 3600 +
          (Number.isFinite(m) ? m : 0) * 60 +
          (Number.isFinite(s) ? s : 0)
        );
      }
    }
    return 0;
  };

  const handleSeekTo = t => {
    const sec = parseTimestampToSeconds(t);
    if (videoRef.current && Number.isFinite(sec)) {
      videoRef.current.currentTime = sec;
      if (typeof videoRef.current.play === 'function') videoRef.current.play();
    }
  };

  const playNextVideoAutomatically = () => {
    if (!nextVideo) return;
    setNextOverlayVisible(false);
    setNextOverlayCountdown(0);
    setAutoPlayNext(true);
    setSelectedVideo(nextVideo);
  };

  const playNextNow = () => {
    if (!nextVideo) return;
    setNextOverlayVisible(false);
    setNextOverlayCountdown(0);
    setAutoPlayNext(true);
    setSelectedVideo(nextVideo);
  };

  const cancelNextOverlay = () => {
    setNextOverlayVisible(false);
    setNextOverlayCountdown(0);
  };

  const handleAskQuestion = async () => {
    if (!chatInput.trim()) return;
    const userMsg = {
      user: {
        fullName: user?.fullName || 'You',
        image: user?.image || '',
        userType: 'USER',
      },
      message: chatInput,
    };
    setChatMessages(prev => [...prev, userMsg]);
    const queryParams = new URLSearchParams(location.search);
    const topicId = queryParams.get('topicId');
    if (topicId) {
      userApi.courses?.askQuestion({
        id: selectedVideo?.topic?._id,
        data: { message: chatInput },
        onSuccess: () => {
          fetchChatMessages(selectedVideo?.topic?._id);
        },
      });
    }
    setChatInput('');
    if (!OPENAI_KEY) {
      const botMsg = {
        user: { fullName: 'Prepo Ai', userType: 'BOT', image: '' },
        message:
          'AI answer unavailable: OpenAI key is not configured. Set VITE_OPENAI_KEY in your .env.',
      };
      setChatMessages(prev => [...prev, botMsg]);
      return;
    }
    try {
      const systemPrompt =
        "You are a helpful tutor. Provide concise, friendly answers to the student's question. If relevant, refer to the course video transcript briefly.";
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-5',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: chatInput },
          ],
        }),
      });
      if (!resp.ok) {
        const errText = await resp.text();
        const botMsg = {
          user: { fullName: 'Prepo Ai', userType: 'BOT', image: '' },
          message: `AI error: ${errText || resp.statusText}`,
        };
        setChatMessages(prev => [...prev, botMsg]);
        return;
      }
      const data = await resp.json();
      const aiText = data?.choices?.[0]?.message?.content?.trim() || 'No answer';
      const botMsg = {
        user: { fullName: 'Prepo Ai', userType: 'BOT', image: '' },
        message: aiText,
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const botMsg = {
        user: { fullName: 'Prepo Ai', userType: 'BOT', image: '' },
        message: 'Network error while contacting AI. Please try again.',
      };
      setChatMessages(prev => [...prev, botMsg]);
    }
  };

  const handleMarkEvaluation = (idx, isCorrect) => {
    setEvaluations(prev => ({
      ...prev,
      [idx]: isCorrect ? 'correct' : 'wrong',
    }));
  };

  const keyMoments = useMemo(() => {
    if (Array.isArray(importantHeadings) && importantHeadings.length) {
      return importantHeadings
        .map(h => ({
          title: String(h.title || '').trim(),
          time: Number.isFinite(h.time) ? Math.max(0, Math.floor(h.time)) : 0,
        }))
        .filter(x => x.title);
    }
    const fallback =
      selectedVideo?.timestamps || selectedVideo?.keyMoments || selectedVideo?.chapters || [];
    return Array.isArray(fallback)
      ? fallback
          .map((c, i) => ({
            title: String(c.title || `Moment ${i + 1}`).trim(),
            time: Number.isFinite(c.time)
              ? Math.max(0, Math.floor(c.time))
              : parseTimestampToSeconds(c.time),
          }))
          .filter(x => x.title)
      : [];
  }, [importantHeadings, selectedVideo]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
console.log(selectedVideo?.handwrittenNotes,"========")
  const tabs = ['Summary', 'Questions', 'Modules', 'Notes'];
console.log({activeTab})
  if (!isPurchased) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-2xl font-semibold text-black">You have not purchased this course</div>
        <div className="text-lg font-semibold text-black">
          Please purchase the course to access this content
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="rounded-t-lg overflow-visible hidden">
        <div className="bg-green-900 text-white flex items-center justify-between px-4 sm:px-6 py-2 sm:py-1 relative z-20">
          <div className="flex items-center space-x-2 z-30">
            <img
              src={images.navBarLogo2}
              alt="Logo"
              className="max-w-[180px] max-h-[60px] sm:max-w-[250px] sm:max-h-[90px] cursor-pointer"
              onClick={() => navigate('/user/home')}
            />
          </div>
          <div className="hidden sm:flex items-center space-x-3"></div>
        </div>
      </div>
      <div className="max-w-8xl mx-auto mt-0 px-3">
        <div className="flex gap-4 items-center my-4">
          <span
            onClick={() => navigate(-1)}
            className="bg-gray-400 text-white p-2 rounded-full cursor-pointer hover:bg-gray-600 transition-colors duration-300"
          >
            <Icon icon="famicons:arrow-back" />
          </span>
          Course / Video
        </div>
        <div className="flex smallScreenFlex gap-8">
          <div className="w-full lg:w-3/4">
            <div className="relative w-full aspect-video rounded-2xl">
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-2xl"
                controls
                src={selectedVideo?.videoLink}
                onLoadedMetadata={handleLoadedMetadata}
              />
              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className="absolute p-2 text-white bg-black rounded-full bottom-2 right-2"
                style={{ zIndex: 10 }}
              >
                <Icon icon={showCaptions ? 'mdi:closed-caption' : 'mdi:closed-caption-outline'} />
              </button>

              {nextOverlayVisible && nextVideo && (
                <div className="absolute right-4 bottom-20 z-40 w-80 bg-white rounded-lg shadow-lg border overflow-hidden">
                  <div className="flex items-center p-3 gap-3">
                    <div className="w-20 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img
                        src={
                          nextVideo?.thumbnail ||
                          nextVideo?.image ||
                          images.navBarLogo2 ||
                          'https://via.placeholder.com/150'
                        }
                        alt={nextVideo?.videoName || 'Next'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800">Up next</div>
                      <div className="text-sm text-gray-700 truncate">
                        {nextVideo?.videoName || 'Next video'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Playing in {nextOverlayCountdown}s
                      </div>
                    </div>
                  </div>
                  <div className="flex border-t">
                    <button
                      onClick={playNextNow}
                      className="flex-1 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                      Play now
                    </button>
                    <button
                      onClick={cancelNextOverlay}
                      className="flex-1 py-2 text-sm font-medium border-l hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {showCaptions && (
                <div className="absolute left-0 right-0 z-10 text-center bottom-16 pointer-events-none">
                  <span className="inline-block px-4 py-2 text-lg text-white bg-black rounded bg-opacity-60">
                    {(() => {
                      if (!wordSegments?.length || currentIndex === -1) return '';
                      const prevCount = 5;
                      const start = Math.max(0, currentIndex - prevCount);
                      const wordsWindow = wordSegments
                        .slice(start, currentIndex + 1)
                        .map(w => w.text)
                        .join(' ');
                      return wordsWindow;
                    })()}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <h1 className="text-2xl font-bold">
                <span className="text-yellow-500"></span>
                {selectedVideo?.videoName || ''}
              </h1>
              <div className="text-sm text-gray-600 flex gap-6">
                <span>6 Lessons</span>
                <span>{videoDuration || selectedVideo?.videoDuration}</span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/4">
            <div>
              <CourseChatBotAi />
            </div>
          </div>
        </div>
        <div className="mt-4 bg-gray-100 p-1 rounded-xl inline-flex w-full sm:w-auto shadow-sm overflow-x-auto">
          {tabs?.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-1.5 text-sm rounded-xl transition-all duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white text-black font-semibold shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Summary' && (
          <div className="space-y-4 text-sm text-gray-700 mt-4">
            <h3 className="text-base font-semibold">📽️ Video Transcript Summary</h3>
            {status === 'idle' && (
              <p className="text-gray-500">Waiting to start transcription...</p>
            )}
            {status === 'loading' && (
              <p className="text-yellow-600">🔄 Generating transcript summary…</p>
            )}
            {status === 'error' && <p className="text-red-600">❌ {error}</p>}
            {status === 'success' && (
              <>
                <div className="bg-[#efefef] border border-yellow-200 p-4 rounded-md text-sm space-y-2">
                  {summary ? (
                    summary
                      .split('\n')
                      .filter(point => point.trim() !== '')
                      .map((point, i) => {
                        const cleanPoint = point.replace(/^[-–•\s]+/, '').trim();
                        return (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-yellow-600 font-bold">•</span>
                            <span className="text-gray-800">{cleanPoint}</span>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-gray-500">No summary available.</div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        {activeTab === 'Assignment' && (
          <div className="space-y-6 mt-4">
            {generatedQuestionsAndAnswers && generatedQuestionsAndAnswers.length ? (
              generatedQuestionsAndAnswers.map((qa, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-2 shadow-sm">
                  <p className="font-medium">
                    {idx + 1}. {qa.question}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => handleMarkEvaluation(idx, true)}
                      disabled={!!evaluations[idx]}
                      className="px-3 py-1 rounded-md border bg-white text-sm text-green-700 disabled:opacity-50"
                    >
                      True
                    </button>
                    <button
                      onClick={() => handleMarkEvaluation(idx, false)}
                      disabled={!!evaluations[idx]}
                      className="px-3 py-1 rounded-md border bg-white text-sm text-red-700 disabled:opacity-50"
                    >
                      False
                    </button>
                  </div>
                  {evaluations[idx] === 'correct' && (
                    <div className="mt-3 text-sm text-green-700 font-medium">Correct</div>
                  )}
                  {evaluations[idx] === 'wrong' && (
                    <div className="mt-3 space-y-2">
                      <div className="text-sm text-red-600 font-medium">Answer is wrong</div>
                      <div className="text-sm bg-gray-50 p-3 rounded">
                        <div className="font-semibold text-xs text-gray-600">Correct Answer</div>
                        <div className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">
                          {qa.answer}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500">No generated questions yet.</div>
            )}
          </div>
        )}
        {activeTab === 'Modules' && (
          <div>
            {/* <div className="mt-4 border rounded-md overflow-hidden">
              <div className="bg-emerald-800 text-white p-2 font-medium">
                🤖 Prepo Ai
              </div>
              <div className="bg-white p-4 space-y-3 text-sm h-96 overflow-y-auto">
                {chatMessages.map((message, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          message.user.image || "https://via.placeholder.com/40"
                        }
                        alt={message.user.fullName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div
                        className={`p-3 rounded-md ${
                          message.user.userType === "BOT"
                            ? "bg-emerald-800 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="font-semibold">{message.user.fullName}</p>
                        <p>{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-100 px-4 py-2 flex items-center">
                <input
                  className="flex-grow bg-transparent outline-none text-sm"
                  placeholder="Type your doubts here..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button
                  className="text-gray-500 ml-2"
                  onClick={handleAskQuestion}
                >
                  ➤
                </button>
              </div>
            </div> */}
            <div className="text-sm text-gray-700 space-y-2 mt-3">
              <div className="flex justify-between font-medium text-gray-800">
                {/* <span className="text-xs font-bold">Modules</span>
                <span className="text-xs text-gray-500">
                  {keyMoments?.length}
                </span> */}
              </div>
              {status === 'loading' && (
                <div className="text-xs text-gray-500">Analyzing transcript…</div>
              )}
              {!keyMoments.length && status !== 'loading' && (
                <div className="text-xs text-gray-500">No modules available.</div>
              )}
              {!!keyMoments.length && (
                <div className="space-y-2">
                  {keyMoments.map((c, i) => (
                    <button
                      key={`${c.title || ''}-${i}`}
                      type="button"
                      onClick={() => handleSeekTo(c.time)}
                      className="w-full flex justify-between items-center text-left p-2 rounded-md border hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-md font-semibold text-gray-800">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-800">
                          {c.title || `Chapter ${i + 1}`}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {typeof c.time === 'number' ? formatDuration(c.time) : c.time}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
       {activeTab === 'Notes' && (
  <div className="mt-4 space-y-3">
    {selectedVideo?.handwrittenNotes?.length > 0 ? (
      selectedVideo?.handwrittenNotes?.map((note, i) => (
        <div
          key={i}
          className="flex items-center bg-white border rounded-lg p-3 shadow-sm cursor-pointer"
          onClick={() =>
            navigate(`/user/notes/${selectedVideo._id}/view`, {
              state: {
                pdfUrl:
                  selectedVideo?.handwrittenNotes?.[0]?.subjects?.[0]
                    ?.subSubjects?.[0]?.chapters?.[0]?.topics?.[0]
                    ?.handwrittenNotes?.[0],
              },
            })
          }
        >
          <img
            src={note?.image}
            alt="Teacher"
            className="w-14 h-14 rounded-md object-cover"
          />

          <div className="ml-4 flex-1">
            <p className="font-semibold">
              Handwritten Note ({i + 1})
            </p>
          </div>

          <div className="text-lg text-gray-400">›</div>
        </div>
      ))
    ) : (
      <div className="text-center text-gray-500 py-10">
        No Data Available
      </div>
    )}
  </div>
)}
      </div>
    </div>
  );
};

export default SkillsPage5;
