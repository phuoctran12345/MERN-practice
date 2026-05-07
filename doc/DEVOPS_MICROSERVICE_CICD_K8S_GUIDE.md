# 🚀 DevOps Role + CI/CD + Kubernetes (DigitalOcean) cho Microservice
> Mục tiêu: bạn (DevOps) giúp team build–test–deploy nhanh, ổn định, an toàn; hệ thống microservice chạy tốt trên Kubernetes (DOKS), dễ scale, dễ quan sát (observability), ít downtime.

---

## 📌 1) DevOps làm gì trong dự án Microservice?

### 1.1. Vai trò chính (theo “pipeline”)
- **Thiết kế hạ tầng (Infrastructure)**  
  - Chọn môi trường: dev/staging/prod  
  - Chọn cách chạy: Docker + Kubernetes (DOKS)  
  - Chọn chiến lược network: Ingress, TLS, DNS, internal service discovery

- **Chuẩn hoá build & image**  
  - Dockerfile chuẩn (multi-stage), tag version rõ ràng  
  - Registry: Docker Hub / GHCR (khuyên dùng GHCR nếu dùng GitHub)

- **Thiết kế CI/CD**  
  - CI: lint, test, build, security scan, build image  
  - CD: deploy lên K8s, rollout an toàn, rollback

- **Quản lý cấu hình & secrets**  
  - ConfigMap / Secret / External Secret (nếu dùng)  
  - Không commit `.env` lên git

- **SRE mindset: reliability & observability**  
  - Monitoring: metrics (CPU/RAM/latency)  
  - Logging: tập trung hoá log  
  - Alerting: báo động lỗi 5xx, latency tăng, pod crashloop

### 1.2. DevOps cần “chốt” với team dev (quan trọng)
- **Contract giữa services**: OpenAPI/Proto, versioning, backward compatible  
- **Healthcheck**: mỗi service phải có `/health` (liveness) và `/ready` (readiness)  
- **12-factor**: config qua env, stateless, log ra stdout/stderr, graceful shutdown

---

## 🔐 2) Flow quyền (role) trong hệ microservice (gợi ý chuẩn)

### 2.1. Mô hình khuyên dùng
- **Auth Service** phát hành JWT/Access Token (hoặc dùng external IdP như Keycloak/Cognito)
- **API Gateway / Ingress**:
  - Validate token cơ bản (chữ ký/exp) hoặc “pass-through”
- **Mỗi microservice tự enforce authorization** (khuyến nghị)
  - Vì service hiểu resource/permission chi tiết nhất

### 2.2. RBAC vs ABAC (hiểu nhanh)
- **RBAC** (Role-Based Access Control): user có role (Admin/Manager/Receptionist...)  
  - Dễ làm, dễ audit  
- **ABAC** (Attribute-Based Access Control): dựa vào thuộc tính (companyId, hotelId, scope...)  
  - Phù hợp hệ “14 công ty” vì multi-tenant

### 2.3. Gợi ý token claims cho multi-tenant
- `sub`: userId  
- `role`: ví dụ `MANAGER`  
- `companyId`: công ty nào  
- `hotelIds` (tuỳ): danh sách hotel user quản lý  
- `scopes`: ví dụ `booking:write`, `hotel:read`

---

## 🔄 3) CI/CD cho microservice (GitHub Actions)
> Bạn không biết CI/CD cũng không sao. Nhớ 1 câu: **CI = kiểm tra code tự động**, **CD = đưa code lên môi trường chạy tự động**.

### 3.0. Bạn hiểu CI/CD trong 60 giây
- **Pipeline**: là “chuỗi bước” chạy tự động mỗi khi bạn push code lên GitHub.
- **CI (Continuous Integration)** làm việc này:
  - Lấy code mới nhất
  - Cài dependencies
  - Chạy lint/test/build để chắc code không lỗi
- **CD (Continuous Delivery/Deployment)** làm tiếp:
  - Build Docker image
  - Push image lên registry
  - Deploy lên server/Kubernetes

### 3.0.1. Với repo của bạn, CI tối thiểu nên có gì?
- **Backend**: `npm ci` → `npm run build`
- **Frontend**: `npm ci` → `npm run lint` → `npm run build`

### 3.0.2. File pipeline nằm ở đâu?
- GitHub Actions đọc các file trong: `.github/workflows/*.yml`
- Mình đã tạo sẵn file CI cho bạn: `.github/workflows/ci.yml`

### 3.0.3. Cách bạn dùng (step-by-step)
1. Commit file pipeline lên GitHub
2. Push lên branch `main` hoặc tạo Pull Request
3. Vào GitHub repo → tab **Actions** → bạn sẽ thấy job chạy


### 3.1. Nguyên tắc CI/CD “đúng bài”
- **CI chạy trên PR**: lint + test + build (không deploy prod)
- **CD chạy trên main**: build image + push registry + deploy staging/prod
- **Versioning**:
  - Tag image bằng `git sha` (bắt buộc) + optional `semver`
  - Không deploy tag “latest” cho production

### 3.2. Pipeline mẫu (mỗi service)
1. Checkout code
2. Install deps
3. Lint
4. Unit test
5. Build (TypeScript compile)
6. Build Docker image (multi-stage)
7. Security scan (tuỳ): Trivy
8. Push image lên registry
9. Deploy K8s (Helm/Kustomize/kubectl apply)
10. Verify rollout + healthcheck

### 3.3. Chiến lược deploy an toàn
- **RollingUpdate**: default cho phần lớn API
- **Blue/Green hoặc Canary**: khi service critical, cần giảm rủi ro
- **Rollback**: dùng `kubectl rollout undo` (hoặc Helm rollback)

### 3.4. Secrets cho GitHub Actions
- `DOCKER_USERNAME`, `DOCKER_PASSWORD` hoặc `GHCR_TOKEN`
- `KUBECONFIG` (hoặc DigitalOcean kubeconfig)
- `DO_CLUSTER_NAME` (nếu dùng doctl)
- Các secrets ứng dụng: DB URL, Redis URL...  
  - **Tip**: secrets app nên nằm trong Kubernetes Secrets, CI chỉ “deploy”, không nên “in secrets vào log”.

---

## ☸️ 4) Kubernetes trên DigitalOcean (DOKS): setup như thế nào?

### 4.1. Kiến trúc cơ bản nên có
- **DOKS Cluster**
- **Node Pool**
  - 1 pool “general” cho API
  - 1 pool “stateful” (nếu thật sự cần chạy DB/Redis trong cluster)
- **Ingress Controller**
  - NGINX Ingress hoặc Traefik
- **cert-manager** để tự cấp TLS (Let’s Encrypt)
- **ExternalDNS** (tuỳ) để tự sync DNS record

### 4.2. Mỗi microservice nên có những YAML gì?
- `Deployment`
- `Service` (ClusterIP)
- `Ingress` (hoặc route qua API Gateway)
- `ConfigMap` + `Secret`
- `HPA` (HorizontalPodAutoscaler)
- `PodDisruptionBudget` (PDB) cho service quan trọng

---

## ⚙️ 5) Setup Pod “hiệu quả” (best practices)

### 5.1. Request/Limit (bắt buộc)
- **requests**: CPU/RAM tối thiểu cần để chạy ổn
- **limits**: giới hạn để tránh 1 pod “ăn” hết node

Gợi ý cho Node.js API (tham khảo, bạn phải đo thực tế):
- `requests`: CPU 100m–250m, RAM 256Mi–512Mi  
- `limits`: CPU 500m–1, RAM 512Mi–1Gi

### 5.2. Readiness / Liveness / Startup probe
- **readinessProbe**: service sẵn sàng nhận traffic chưa? (đợi connect DB/Redis xong)
- **livenessProbe**: service bị treo thì restart
- **startupProbe**: nếu app boot lâu, tránh bị kill sớm

### 5.3. Autoscaling (HPA)
- Dựa trên CPU (đơn giản nhất), hoặc custom metric (RPS/latency) nếu có Prometheus
- Khuyến nghị có **minReplicas >= 2** cho production để tránh downtime khi rolling update

### 5.4. Anti-affinity & topology spread
Mục tiêu: 2 pod không nằm cùng 1 node (giảm rủi ro node chết).
- Dùng `podAntiAffinity` hoặc `topologySpreadConstraints`

### 5.5. Graceful shutdown (Node.js cực quan trọng)
- App phải handle `SIGTERM` và dừng nhận request mới, chờ request đang xử lý xong (timeout hợp lý).
- K8s sẽ gửi `SIGTERM` trước khi kill pod.

### 5.6. Logging
- Log ra stdout/stderr (không log vào file trong container)
- Dùng log collector (DigitalOcean có tích hợp hoặc dùng Loki/EFK)

---

## 🧠 6) Khi nào nên dùng Redis?

### 6.1. Bạn nên dùng Redis khi
- **Caching**:
  - Cache dữ liệu đọc nhiều (hotel list, room availability theo điều kiện phổ biến)
  - Cache response tạm thời để giảm load DB
- **Session store** (nếu bạn dùng session-based auth)
- **Rate limiting** (IP/user) ở gateway/API
- **Distributed lock** (cẩn thận) để tránh double booking / xử lý job trùng  
  - Ví dụ: lock theo `roomId + dateRange` vài giây
- **Queue / background jobs**:
  - BullMQ (Node) dùng Redis làm backend queue

### 6.2. Bạn KHÔNG nên dùng Redis khi
- Dữ liệu cần **strong consistency** như “nguồn sự thật” (source of truth) → DB chính vẫn là MongoDB/Postgres
- Cache mà không có chiến lược invalidation (dễ bị stale data)

### 6.3. Rule of thumb (nhớ nhanh)
- **DB** = lưu lâu dài, đúng tuyệt đối  
- **Redis** = nhanh, tạm thời, có thể mất được (cache/queue/lock)

---

## 🗄️ 7) Làm thế nào để “để database vào pod/container”?
> Câu này có 2 hướng: (A) chạy DB trong K8s, (B) dùng managed database bên ngoài cluster. Với production, **khuyên dùng B**.

### 7.1. Khuyến nghị production (nên làm)
- **MongoDB**: MongoDB Atlas / DigitalOcean Managed MongoDB (nếu có)  
- **Postgres/MySQL**: DigitalOcean Managed Database  
- App pods chỉ cần env:
  - `MONGODB_CONNECTION_STRING=...`
  - `DATABASE_URL=...`

Lý do:
- Backup/restore dễ hơn
- Upgrades dễ hơn
- Tính ổn định cao hơn (đặc biệt khi node/pod restart)

### 7.2. Khi nào mới nên chạy DB trong cluster?
Chỉ nên cân nhắc khi:
- Bạn cần môi trường **dev/staging** nhanh gọn
- Bạn có kinh nghiệm vận hành stateful workloads (backup, restore, rolling upgrade)
- Bạn chấp nhận rủi ro & chi phí vận hành

### 7.3. Nếu vẫn muốn chạy DB trong K8s (cách đúng)
> Keyword bạn cần nhớ: **StatefulSet + PersistentVolumeClaim (PVC) + StorageClass + Backup**.

#### A) MongoDB trong K8s (gợi ý)
- **Cách dễ nhất**: dùng Helm chart (Bitnami) cho dev/staging
- **Production thật**: nên dùng MongoDB Operator (phức tạp hơn) + backup chuẩn

#### B) Những “mảnh ghép” bắt buộc khi chạy DB trong cluster
- **StatefulSet**: mỗi pod có identity cố định (`mongodb-0`, `mongodb-1`...)  
- **PVC per pod**: mỗi replica có ổ đĩa riêng  
- **StorageClass**: dùng block storage của DigitalOcean (Dynamic Provisioning)  
- **PodDisruptionBudget**: tránh K8s tự “evict” hết DB pod cùng lúc  
- **Backup**:
  - Snapshot volume (tuỳ) **không đủ** nếu không đảm bảo consistency
  - Tốt nhất: job backup logic-level (mongodump) + upload object storage

#### C) Những lỗi newbie hay dính (tránh)
- Chạy DB bằng `Deployment` (sai) → mất data khi pod recreate
- Không có PVC → data nằm trong container filesystem → pod chết là mất
- Không tách node pool stateful → DB cạnh tranh tài nguyên với API
- Không có backup/restore rehearsal → “có backup” nhưng không restore được

### 7.4. Nếu bạn dùng Azure Data Studio thì liên quan gì?
- Azure Data Studio hợp với hệ **SQL** (SQL Server / Postgres extension...).  
- Còn dự án dùng **Mongoose/MongoDB** thì bạn sẽ quản trị bằng:
  - MongoDB Atlas UI, hoặc MongoDB Compass, hoặc mongosh.

---

## ✅ 8) Checklist nhanh cho production (tóm tắt)
- **Microservice**:
  - [ ] Có `/ready` và `/health`
  - [ ] Có graceful shutdown (SIGTERM)
  - [ ] Requests/Limits đúng
  - [ ] HPA + minReplicas >= 2
- **K8s/DOKS**:
  - [ ] Ingress + TLS (cert-manager)
  - [ ] PDB cho service quan trọng
  - [ ] Observability: logs + metrics + alert
- **Data layer**:
  - [ ] Production dùng managed DB (khuyến nghị)
  - [ ] Redis chỉ dùng đúng mục đích (cache/queue/rate-limit/lock)

---

## 📨 9) Kafka trong microservice (thiết kế + triển khai)
> Kafka dùng tốt cho event-driven: booking created, payment succeeded, check-in/out events... giúp các service “tách rời” (decouple) và scale độc lập.

### 9.1. Khi nào nên dùng Kafka?
- **Event-driven**: publish event để service khác subscribe (không gọi sync API)
- **Async processing**: gửi email, generate invoice, indexing search, analytics
- **Streaming**: xử lý luồng dữ liệu (real-time)

### 9.2. Nguyên tắc thiết kế topic (rất quan trọng)
- **Topic naming** (gợi ý): `hotel.booking.v1`, `payment.transaction.v1`
- **Partition key**: chọn key để giữ ordering theo “đúng thực thể”
  - Ví dụ booking: key = `bookingId` (đảm bảo event của 1 booking theo thứ tự)
- **Schema**: có version (v1/v2), backward compatible
- **Delivery semantics**: thực tế thường là **at-least-once** → consumer phải **idempotent**

### 9.3. Triển khai Kafka trên Kubernetes (khuyến nghị)
#### Option A (khuyên dùng): **Strimzi Kafka Operator**
- Ưu điểm: cài đặt/scale/rolling upgrade dễ hơn, phù hợp K8s
- Flow tổng quát:
  1. Cài Strimzi Operator (Helm hoặc manifest)
  2. Tạo `Kafka` CR (Custom Resource) để tạo cluster
  3. Tạo `KafkaTopic`, `KafkaUser` (nếu bật auth)

#### Option B: Helm chart “thuần”
- Nhanh cho dev/staging, nhưng vận hành production khó hơn operator

### 9.4. Checklist production cho Kafka
- **Storage**: Kafka là stateful → cần PVC + storage class ổn định
- **Replication factor**: >= 3 (nếu cluster đủ broker)
- **Min in-sync replicas**: cấu hình để tránh data loss
- **Auth**: SASL/SCRAM hoặc mTLS (tuỳ mô hình)
- **Network policy**: chỉ cho namespace/service cần thiết truy cập
- **Monitoring**: consumer lag, broker disk usage, under-replicated partitions

---

## 🌐 10) Load Balancer trên DigitalOcean Kubernetes (DOKS)
> Trên DOKS, bạn thường có 2 lớp: (1) DigitalOcean Load Balancer (L4) và (2) Ingress Controller (L7).

### 10.1. Mô hình khuyên dùng (đa số dự án)
- **Ingress Controller** (NGINX/Traefik) chạy trong cluster
- Expose Ingress Controller bằng **Service type `LoadBalancer`**
  - DigitalOcean tự tạo 1 Load Balancer public IP
- Routing theo domain/path:
  - `api.yourdomain.com` → API Gateway / BFF
  - `*.yourdomain.com` hoặc `/service-a` → service tương ứng

### 10.2. Khi nào dùng Service type LoadBalancer trực tiếp cho service?
Chỉ nên khi:
- Service là **TCP/UDP** (không phải HTTP) hoặc cần public riêng
- Bạn muốn “mỗi service 1 LB” (tốn tiền hơn, quản lý khó hơn)

### 10.3. Best practices
- **TLS termination**:
  - Thường terminate TLS ở Ingress + cert-manager
- **Health check**:
  - Ingress controller phải có readiness/liveness ổn
- **High availability**:
  - Ingress controller nên chạy >= 2 replicas
- **Rate limit / WAF**:
  - Có thể làm ở Ingress (NGINX annotations) hoặc ở API Gateway

---

## 🧊 11) Cache layer (thiết kế + triển khai)
> Cache layer giúp giảm tải DB/Kafka consumers và tăng tốc API. Nhưng cache sai sẽ gây “stale data” (dữ liệu cũ).

### 11.1. Cache patterns (nhớ 3 cái này)
- **Cache-aside** (phổ biến nhất):
  - App đọc cache → miss thì đọc DB → set cache với TTL
- **Write-through**:
  - App ghi cache và DB cùng lúc (đồng bộ) → đơn giản nhưng chậm hơn
- **Invalidate on write**:
  - Khi DB update, xoá key cache liên quan (hoặc publish invalidation event)

### 11.2. TTL + Key design cho multi-tenant
- Key nên có `companyId` để tránh “đụng dữ liệu” giữa 14 công ty
  - Ví dụ: `company:{companyId}:hotel:{hotelId}:rooms:available:{hash(query)}`
- TTL tuỳ use-case:
  - Availability search: TTL ngắn (10–60s)
  - Hotel detail: TTL dài hơn (5–30 phút)

### 11.3. Triển khai cache trong K8s
- **Khuyên dùng production**: Redis managed (nếu có) hoặc Redis chạy riêng VM
- Nếu chạy trong cluster:
  - Dùng Helm chart Redis (bitnami) + PVC
  - Bật persistence nếu cần (AOF/RDB), nhưng nhớ: cache “mất được” thì không cần quá nặng

### 11.4. Những lỗi hay gặp
- Cache “mọi thứ” → RAM phình + eviction loạn
- Không có invalidation strategy → người dùng thấy dữ liệu sai
- Dùng Redis làm DB chính → dễ mất dữ liệu khi failover/misconfig

---

## 🔎 12) Elasticsearch cho search (triển khai + vận hành)
> Elasticsearch hợp cho tìm kiếm: khách sạn, phòng, amenities, autocomplete. Không thay thế DB chính.

### 12.1. Khuyến nghị kiến trúc search trong microservice
- **Source of truth**: MongoDB/Postgres
- **Search index**: Elasticsearch
- **Sync dữ liệu**:
  - Cách 1: App ghi DB xong → publish Kafka event → consumer index vào ES
  - Cách 2: CDC (phức tạp hơn) → Debezium + Kafka Connect

### 12.2. Triển khai Elasticsearch: chọn hướng nào?
#### Option A (khuyên dùng production): Managed Elasticsearch
- Elastic Cloud hoặc dịch vụ managed tương tự
- Ưu: backup, upgrade, stability dễ hơn

#### Option B: Chạy trong DOKS bằng Operator
- Dùng **Elastic Cloud on Kubernetes (ECK)** (Operator)
- Bắt buộc:
  - Stateful storage (PVC)
  - Heap sizing đúng (JVM heap)
  - Anti-affinity để tránh 2 data node cùng 1 node

### 12.3. Checklist production cho Elasticsearch
- **Sizing**:
  - JVM heap không quá ~50% RAM container
  - Đủ disk, tránh full disk (ES rất nhạy)
- **Index lifecycle** (ILM):
  - Có policy rollover/retention nếu log/search data lớn
- **Snapshots**:
  - Snapshot repo lên object storage (S3-compatible) và test restore
- **Security**:
  - Bật auth, không expose ES public trực tiếp
- **Monitoring**:
  - JVM GC, heap usage, search latency, indexing rate, disk watermark

---

## ✅ 13) “Bản đồ triển khai” gợi ý (end-to-end)
- **Ingress + cert-manager**: 1 entrypoint HTTP(S)
- **API Gateway/BFF**: route request, auth, rate limit
- **Microservices**: stateless, autoscale bằng HPA
- **Kafka**: event bus (Strimzi), topics theo domain, consumer idempotent
- **Redis**: cache + queue/rate limit (tuỳ)
- **Elasticsearch**: search index, update bằng Kafka consumer

