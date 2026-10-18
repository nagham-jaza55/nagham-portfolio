"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  Circle,
  Command,
  Folder,
  LayoutDashboard,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import "./project-preview.css";

type PreviewTheme = "orbit" | "forma" | "pulse";
type ProjectPreviewProps = { theme: PreviewTheme; interactive?: boolean };
type Task = {
  title: string;
  tag: string;
  color: string;
  initials: string;
  stage: number;
};

const initialTasks: Task[] = [
  {
    title: "Explore onboarding flow",
    tag: "Design",
    color: "violet",
    initials: "NK",
    stage: 0,
  },
  {
    title: "Write API documentation",
    tag: "Engineering",
    color: "blue",
    initials: "AM",
    stage: 0,
  },
  {
    title: "Build the dashboard",
    tag: "Engineering",
    color: "blue",
    initials: "JD",
    stage: 1,
  },
  {
    title: "Refine the design system",
    tag: "Design",
    color: "violet",
    initials: "NK",
    stage: 1,
  },
  {
    title: "Set up authentication",
    tag: "Engineering",
    color: "blue",
    initials: "AM",
    stage: 2,
  },
  {
    title: "Map the user journey",
    tag: "Research",
    color: "orange",
    initials: "SL",
    stage: 2,
  },
];

export function ProjectPreview({
  theme,
  interactive = false,
}: ProjectPreviewProps) {
  return (
    <div
      className={`project-preview preview-${theme}${interactive ? " is-interactive" : ""}`}
      aria-hidden={interactive ? undefined : true}
    >
      {theme === "orbit" && <OrbitPreview interactive={interactive} />}
      {theme === "forma" && <FormaPreview interactive={interactive} />}
      {theme === "pulse" && <PulsePreview interactive={interactive} />}
    </div>
  );
}

function OrbitPreview({ interactive }: { interactive: boolean }) {
  const taskIdPrefix = useId();
  const taskElements = useRef(new Map<number, HTMLButtonElement>());
  const pendingFocusIndex = useRef<number | null>(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [lastAction, setLastAction] = useState(
    "Click a task to move it to the next column.",
  );

  // A task changes grid columns when moved, so restore focus after React remounts it.
  useLayoutEffect(() => {
    if (pendingFocusIndex.current !== null) {
      taskElements.current.get(pendingFocusIndex.current)?.focus();
      pendingFocusIndex.current = null;
    }
  }, [tasks]);

  function moveTask(index: number) {
    pendingFocusIndex.current = index;
    const nextStage = (tasks[index].stage + 1) % 3;
    setTasks((current) =>
      current.map((task, taskIndex) =>
        taskIndex === index ? { ...task, stage: nextStage } : task,
      ),
    );
    setLastAction(
      `${tasks[index].title} moved to ${["To do", "In progress", "Done"][nextStage]}.`,
    );
  }

  function addTask() {
    pendingFocusIndex.current = tasks.length;
    setTasks((current) => [
      ...current,
      {
        title: `Plan next release ${current.length - 5}`,
        tag: "Planning",
        color: "orange",
        initials: "YOU",
        stage: 0,
      },
    ]);
    setLastAction("New release task added to To do.");
  }

  return (
    <div className="preview-scene orbit-scene">
      <div className="mini-app orbit-app">
        <aside className="orbit-sidebar">
          <div className="orbit-wordmark">
            <span className="orbit-mark" />
            orbit<span className="mini-pro">PRO</span>
          </div>
          <div className="mini-workspace">
            <span>O</span> Orbit studio <ChevronDown />
          </div>
          <span className="mini-nav-item">
            <Search /> Search <kbd>⌘ K</kbd>
          </span>
          <span className="mini-nav-item">
            <LayoutDashboard /> Overview
          </span>
          <span className="mini-nav-item selected">
            <Folder /> Projects <span className="mini-count">4</span>
          </span>
          <span className="mini-nav-item">
            <Users /> Team members
          </span>
          <span className="mini-sidebar-label">YOUR WORKSPACE</span>
          <span className="mini-nav-item">
            <span className="mini-dot lime" /> Product launch
          </span>
          <span className="mini-nav-item">
            <span className="mini-dot purple" /> Website redesign
          </span>
          <div className="mini-sidebar-bottom">
            <Settings /> Settings <span className="mini-avatar">NK</span>
          </div>
        </aside>
        <div className="orbit-main">
          <div className="mini-topbar">
            <span>
              Workspace <span className="mini-slash">/</span>{" "}
              <strong>Product launch</strong>
            </span>
            <div>
              <Bell />
              <span className="mini-avatar">NK</span>
            </div>
          </div>
          <div className="orbit-content">
            <div className="orbit-title-row">
              <div>
                <span className="mini-eyebrow">LET’S MAKE THINGS HAPPEN</span>
                <h4 aria-level={interactive ? 3 : undefined}>
                  Product launch <span>✦</span>
                </h4>
                <p>Your next big thing starts here.</p>
              </div>
              <button
                type="button"
                className="mini-primary"
                disabled={!interactive || tasks.length >= 8}
                tabIndex={interactive ? 0 : -1}
                onClick={addTask}
              >
                <Plus /> New task
              </button>
            </div>
            <div className="orbit-board-bar">
              <span className="mini-board-tab">
                <LayoutDashboard /> Board view
              </span>
              <span className="mini-board-members">
                <i>NK</i>
                <i>AM</i>
                <i>JD</i>
                <b>+2</b>
              </span>
              <SlidersHorizontal />
            </div>
            <div className="orbit-board">
              {["To do", "In progress", "Done"].map((stage, stageIndex) => (
                <div className="orbit-column" key={stage}>
                  <div className="orbit-column-heading">
                    <span className={`mini-dot stage-${stageIndex}`} />
                    <span>{stage}</span>
                    <span className="mini-column-count">
                      {tasks.filter((task) => task.stage === stageIndex).length}
                    </span>
                    <MoreHorizontal />
                  </div>
                  {tasks.map(
                    (task, taskIndex) =>
                      task.stage === stageIndex && (
                        <button
                          id={`${taskIdPrefix}-task-${taskIndex}`}
                          ref={(element) => {
                            if (element)
                              taskElements.current.set(taskIndex, element);
                            else taskElements.current.delete(taskIndex);
                          }}
                          type="button"
                          className="mini-task"
                          key={taskIndex}
                          onClick={() => moveTask(taskIndex)}
                          disabled={!interactive}
                          tabIndex={interactive ? 0 : -1}
                        >
                          <span className={`mini-task-tag ${task.color}`}>
                            {task.tag}
                          </span>
                          <strong>{task.title}</strong>
                          <span className="mini-task-footer">
                            <span>
                              {stageIndex === 2 ? <Check /> : <Circle />}{" "}
                              {stageIndex === 2 ? "Completed" : "Oct 24"}
                            </span>
                            <span
                              className={`mini-avatar avatar-${task.color}`}
                            >
                              {task.initials}
                            </span>
                          </span>
                          <span className="sr-only">
                            Move to{" "}
                            {["In progress", "Done", "To do"][stageIndex]}
                          </span>
                        </button>
                      ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {interactive && (
        <p className="mini-interaction-note" role="status">
          {lastAction}
        </p>
      )}
    </div>
  );
}

function FormaPreview({ interactive }: { interactive: boolean }) {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="preview-scene forma-scene">
      <div className="mini-app forma-app">
        <div className="forma-nav">
          <span className="forma-wordmark">
            forma<span>®</span>
          </span>
          <div>
            <span>Shop</span>
            <span>Our story</span>
            <span>Journal</span>
          </div>
          <span className="forma-cart">
            <ShoppingBag />
            <span aria-live={interactive ? "polite" : "off"}>
              {cartCount.toString().padStart(2, "0")}
            </span>
          </span>
        </div>
        <div className="forma-product">
          <div className="forma-copy">
            <span className="forma-eyebrow">
              <span /> CONSIDERED LIVING
            </span>
            <h4 aria-level={interactive ? 3 : undefined}>
              Less, but
              <br />
              <em>better.</em>
            </h4>
            <p>
              Thoughtfully made objects.
              <br />
              For spaces that feel like you.
            </p>
            <span className="forma-discover">
              Explore the collection <ArrowRight />
            </span>
            <div className="forma-edition">
              <span>01 / 03</span>
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="forma-product-art">
            <span className="forma-new">THE EVERYDAY COLLECTION</span>
            <div className="forma-chair" aria-hidden="true">
              <div className="chair-shadow" />
              <div className="chair-leg chair-leg-back-left" />
              <div className="chair-leg chair-leg-back-right" />
              <div className="chair-back" />
              <div className="chair-back-grain" />
              <div className="chair-seat" />
              <div className="chair-leg chair-leg-front-left" />
              <div className="chair-leg chair-leg-front-right" />
            </div>
            <span className="forma-material">
              <span /> Natural oak. Honest materials.
            </span>
          </div>
        </div>
        <div className="forma-product-bar">
          <div>
            <span>CRAFTED TO STAY</span>
            <h5 aria-level={interactive ? 4 : undefined}>
              The Everyday Chair <small>Natural oak / linen</small>
            </h5>
          </div>
          <strong>€249</strong>
          <button
            type="button"
            className="forma-add"
            disabled={!interactive}
            tabIndex={interactive ? 0 : -1}
            onClick={() => setCartCount((count) => count + 1)}
            aria-label={
              cartCount
                ? "Add another Everyday Chair"
                : "Add to bag: The Everyday Chair"
            }
          >
            {cartCount ? "Add another" : "Add to bag"}
            <Plus />
          </button>
        </div>
      </div>
      {interactive && (
        <p className="mini-interaction-note" role="status">
          {cartCount
            ? `${cartCount} ${cartCount === 1 ? "chair" : "chairs"} in your demo bag · €${(cartCount * 249).toLocaleString("en")}`
            : "Try adding the Everyday Chair to your bag."}
        </p>
      )}
    </div>
  );
}

const chartPeriods = {
  "1W": {
    revenue: "$12,840",
    growth: "+12.8%",
    users: "1,284",
    chart:
      "M0 94 C20 100 24 75 45 80 S72 108 94 76 S128 70 146 48 S170 76 196 43 S225 60 245 32 S272 40 300 8",
    labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  },
  "1M": {
    revenue: "$48,295",
    growth: "+24.6%",
    users: "8,549",
    chart:
      "M0 104 C18 106 20 83 40 89 S64 102 82 68 S105 91 125 65 S143 82 165 42 S194 54 212 33 S232 58 251 20 S278 33 300 6",
    labels: [
      "OCT 01",
      "OCT 05",
      "OCT 10",
      "OCT 15",
      "OCT 20",
      "OCT 25",
      "OCT 31",
    ],
  },
  "1Y": {
    revenue: "$524,180",
    growth: "+38.2%",
    users: "92,310",
    chart:
      "M0 108 C30 107 30 95 55 97 S85 87 107 83 S131 61 155 68 S185 46 204 42 S232 45 252 22 S279 22 300 3",
    labels: ["JAN", "MAR", "MAY", "JUL", "SEP", "NOV", "DEC"],
  },
};

function PulsePreview({ interactive }: { interactive: boolean }) {
  const [period, setPeriod] = useState<keyof typeof chartPeriods>("1M");
  const gradientId = useId();
  const data = chartPeriods[period];

  return (
    <div className="preview-scene pulse-scene">
      <div className="mini-app pulse-app">
        <aside className="pulse-sidebar">
          <span className="pulse-logo">
            <Activity />
          </span>
          <span className="pulse-nav-icon selected">
            <LayoutDashboard />
          </span>
          <span className="pulse-nav-icon">
            <Activity />
          </span>
          <span className="pulse-nav-icon">
            <Users />
          </span>
          <span className="pulse-nav-icon">
            <Command />
          </span>
          <span className="pulse-nav-icon pulse-settings">
            <Settings />
          </span>
          <span className="mini-avatar">NK</span>
        </aside>
        <div className="pulse-main">
          <div className="mini-topbar">
            <span>
              <strong>pulse</strong>
              <span className="mini-slash">/</span> Overview
            </span>
            <div>
              <span className="pulse-live">
                <span /> Live data
              </span>
              <Bell />
            </div>
          </div>
          <div className="pulse-content">
            <div className="pulse-heading">
              <div>
                <h4 aria-level={interactive ? 3 : undefined}>
                  Your business, at a glance<span>.</span>
                </h4>
                <p>A little clarity. A lot of possibility.</p>
              </div>
              <span className="pulse-date">
                October 2026 <ChevronDown />
              </span>
            </div>
            <div className="pulse-metrics">
              <div className="pulse-metric">
                <span>
                  Total revenue <ArrowUpRight />
                </span>
                <strong>{data.revenue}</strong>
                <small>
                  <ArrowUpRight /> {data.growth} <span>vs. last period</span>
                </small>
              </div>
              <div className="pulse-metric">
                <span>
                  Active users <Users />
                </span>
                <strong>{data.users}</strong>
                <small>
                  <ArrowUpRight /> +18.2% <span>vs. last period</span>
                </small>
              </div>
              <div className="pulse-metric">
                <span>
                  Conversion rate <Zap />
                </span>
                <strong>
                  4.82<span>%</span>
                </strong>
                <small>
                  <ArrowUpRight /> +2.4% <span>vs. last period</span>
                </small>
              </div>
            </div>
            <div className="pulse-chart-card">
              <div className="pulse-chart-heading">
                <span>
                  Revenue overview{" "}
                  <span className="pulse-chart-legend">
                    <i /> Revenue
                  </span>
                </span>
                <div
                  className="pulse-periods"
                  role={interactive ? "group" : undefined}
                  aria-label={interactive ? "Chart time period" : undefined}
                >
                  {(
                    Object.keys(chartPeriods) as (keyof typeof chartPeriods)[]
                  ).map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={value === period ? "active" : ""}
                      disabled={!interactive}
                      tabIndex={interactive ? 0 : -1}
                      aria-pressed={value === period}
                      onClick={() => setPeriod(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pulse-chart">
                <div className="pulse-chart-scale">
                  <span>$50k</span>
                  <span>$30k</span>
                  <span>$10k</span>
                </div>
                <div className="pulse-chart-plot">
                  <div className="pulse-chart-lines">
                    <i />
                    <i />
                    <i />
                  </div>
                  <svg
                    viewBox="0 0 300 120"
                    preserveAspectRatio="none"
                    role={interactive ? "img" : undefined}
                    aria-label={
                      interactive
                        ? `Revenue trend for ${period === "1W" ? "one week" : period === "1M" ? "one month" : "one year"}: ${data.revenue}, up ${data.growth}`
                        : undefined
                    }
                  >
                    <defs>
                      <linearGradient
                        id={gradientId}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#a58cff"
                          stopOpacity=".3"
                        />
                        <stop
                          offset="100%"
                          stopColor="#a58cff"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d={`${data.chart} L300 120 L0 120 Z`}
                      fill={`url(#${gradientId})`}
                    />
                    <path
                      d={data.chart}
                      fill="none"
                      stroke="#b49bff"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle
                      cx="300"
                      cy={period === "1W" ? 8 : period === "1M" ? 6 : 3}
                      r="3"
                      fill="#d7c9ff"
                    />
                  </svg>
                  <div className="pulse-chart-labels">
                    {data.labels.map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="pulse-bottom">
              <span>
                <Sparkles /> Looking good. Revenue is growing faster this month.
              </span>
              <ArrowDownLeft />
            </div>
          </div>
        </div>
      </div>
      {interactive && (
        <p className="mini-interaction-note" role="status">
          Select a period to explore the sample revenue data.
        </p>
      )}
    </div>
  );
}
