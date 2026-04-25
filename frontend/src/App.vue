<script setup>
import {onMounted, reactive, ref} from 'vue';
import request from './api/request';

const loading = ref(false);
const message = ref('');

const departments = ref([]);
const workers = ref([]);
const projects = ref([]);
const participations = ref([]);

const departmentQueryDid = ref('');
const departmentQueryResult = ref(null);

const departmentCreate = reactive({did: '', name: '', location: ''});
const departmentUpdate = reactive({did: '', name: '', location: ''});
const departmentDeleteDid = ref('');

const workerQueryWid = ref('');
const workerQueryResult = ref(null);

const workerCreate = reactive({
  wid: '',
  name: '',
  age: '',
  gender: '',
  address: '',
  email: '',
  salary: '',
  did: '',
});
const workerUpdate = reactive({
  wid: '',
  name: '',
  age: '',
  gender: '',
  address: '',
  email: '',
  salary: '',
  did: '',
});
const workerDeleteWid = ref('');

const projectQueryPid = ref('');
const projectQueryResult = ref(null);

const projectCreate = reactive({pid: '', name: '', status: '', did: ''});
const projectUpdate = reactive({pid: '', name: '', status: '', did: ''});
const projectDeletePid = ref('');

const participationQuery = reactive({wid: '', pid: ''});
const participationQueryResult = ref(null);

const participationCreate = reactive({wid: '', pid: '', role: '', work_hour: ''});
const participationUpdate = reactive({wid: '', pid: '', role: '', work_hour: ''});
const participationDelete = reactive({wid: '', pid: ''});

const toNumberOrNull = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const setMessage = (text) => {
  message.value = text;
};

const handleError = (error) => {
  setMessage(error.message || '操作失败');
};

const withLoading = async (action) => {
  loading.value = true;
  try {
    await action();
  } finally {
    loading.value = false;
  }
};

const fetchDepartments = async () => {
  const result = await request.get('/departments');
  departments.value = result.data || [];
};

const fetchWorkers = async () => {
  const result = await request.get('/workers');
  workers.value = result.data || [];
};

const fetchProjects = async () => {
  const result = await request.get('/projects');
  projects.value = result.data || [];
};

const fetchParticipations = async () => {
  const result = await request.get('/participations');
  participations.value = result.data || [];
};

const refreshDepartments = async () => {
  try {
    await withLoading(async () => {
      await fetchDepartments();
      setMessage('部门批量查询成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const refreshWorkers = async () => {
  try {
    await withLoading(async () => {
      await fetchWorkers();
      setMessage('员工批量查询成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const refreshProjects = async () => {
  try {
    await withLoading(async () => {
      await fetchProjects();
      setMessage('项目批量查询成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const refreshParticipations = async () => {
  try {
    await withLoading(async () => {
      await fetchParticipations();
      setMessage('参与关系批量查询成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const queryDepartment = async () => {
  try {
    await withLoading(async () => {
      const result = await request.get(`/departments/${Number(departmentQueryDid.value)}`);
      departmentQueryResult.value = result.data;
      setMessage('部门查询成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const queryWorker = async () => {
  try {
    await withLoading(async () => {
      const result = await request.get(`/workers/${Number(workerQueryWid.value)}`);
      workerQueryResult.value = result.data;
      setMessage('员工查询成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const queryProject = async () => {
  try {
    await withLoading(async () => {
      const result = await request.get(`/projects/${Number(projectQueryPid.value)}`);
      projectQueryResult.value = result.data;
      setMessage('项目查询成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const queryParticipation = async () => {
  try {
    await withLoading(async () => {
      const result = await request.get(
          `/participations/${Number(participationQuery.wid)}/${Number(participationQuery.pid)}`
      );
      participationQueryResult.value = result.data;
      setMessage('参与关系查询成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const refreshAll = async () => {
  await withLoading(async () => {
    await Promise.all([fetchDepartments(), fetchWorkers(), fetchProjects(), fetchParticipations()]);
    setMessage('数据刷新成功');
  });
};

const createDepartment = async () => {
  try {
    await withLoading(async () => {
      await request.post('/departments', {
        did: Number(departmentCreate.did),
        name: departmentCreate.name,
        location: departmentCreate.location || null,
      });
      await fetchDepartments();
      setMessage('部门创建成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const updateDepartment = async () => {
  try {
    await withLoading(async () => {
      const payload = {};
      if (departmentUpdate.name !== '') payload.name = departmentUpdate.name;
      if (departmentUpdate.location !== '') payload.location = departmentUpdate.location;
      await request.put(`/departments/${Number(departmentUpdate.did)}`, payload);
      await fetchDepartments();
      setMessage('部门更新成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const deleteDepartment = async () => {
  try {
    await withLoading(async () => {
      await request.delete(`/departments/${Number(departmentDeleteDid.value)}`);
      await fetchDepartments();
      setMessage('部门删除成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const createWorker = async () => {
  try {
    await withLoading(async () => {
      await request.post('/workers', {
        wid: Number(workerCreate.wid),
        name: workerCreate.name,
        age: toNumberOrNull(workerCreate.age),
        gender: workerCreate.gender || null,
        address: workerCreate.address || null,
        email: workerCreate.email || null,
        salary: toNumberOrNull(workerCreate.salary),
        did: toNumberOrNull(workerCreate.did),
      });
      await fetchWorkers();
      setMessage('员工创建成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const updateWorker = async () => {
  try {
    await withLoading(async () => {
      const payload = {};
      if (workerUpdate.name !== '') payload.name = workerUpdate.name;
      if (workerUpdate.age !== '') payload.age = toNumberOrNull(workerUpdate.age);
      if (workerUpdate.gender !== '') payload.gender = workerUpdate.gender;
      if (workerUpdate.address !== '') payload.address = workerUpdate.address;
      if (workerUpdate.email !== '') payload.email = workerUpdate.email;
      if (workerUpdate.salary !== '') payload.salary = toNumberOrNull(workerUpdate.salary);
      if (workerUpdate.did !== '') payload.did = toNumberOrNull(workerUpdate.did);
      await request.put(`/workers/${Number(workerUpdate.wid)}`, payload);
      await fetchWorkers();
      setMessage('员工更新成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const deleteWorker = async () => {
  try {
    await withLoading(async () => {
      await request.delete(`/workers/${Number(workerDeleteWid.value)}`);
      await fetchWorkers();
      setMessage('员工删除成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const createProject = async () => {
  try {
    await withLoading(async () => {
      await request.post('/projects', {
        pid: Number(projectCreate.pid),
        name: projectCreate.name,
        status: projectCreate.status,
        did: toNumberOrNull(projectCreate.did),
      });
      await fetchProjects();
      setMessage('项目创建成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const updateProject = async () => {
  try {
    await withLoading(async () => {
      const payload = {};
      if (projectUpdate.name !== '') payload.name = projectUpdate.name;
      if (projectUpdate.status !== '') payload.status = projectUpdate.status;
      if (projectUpdate.did !== '') payload.did = toNumberOrNull(projectUpdate.did);
      await request.put(`/projects/${Number(projectUpdate.pid)}`, payload);
      await fetchProjects();
      setMessage('项目更新成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const deleteProject = async () => {
  try {
    await withLoading(async () => {
      await request.delete(`/projects/${Number(projectDeletePid.value)}`);
      await fetchProjects();
      setMessage('项目删除成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const createParticipation = async () => {
  try {
    await withLoading(async () => {
      await request.post('/participations', {
        wid: Number(participationCreate.wid),
        pid: Number(participationCreate.pid),
        role: participationCreate.role || null,
        work_hour: toNumberOrNull(participationCreate.work_hour),
      });
      await fetchParticipations();
      setMessage('参与关系创建成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const updateParticipation = async () => {
  try {
    await withLoading(async () => {
      const payload = {};
      if (participationUpdate.role !== '') payload.role = participationUpdate.role;
      if (participationUpdate.work_hour !== '') payload.work_hour = toNumberOrNull(participationUpdate.work_hour);
      await request.put(
          `/participations/${Number(participationUpdate.wid)}/${Number(participationUpdate.pid)}`,
          payload
      );
      await fetchParticipations();
      setMessage('参与关系更新成功');
    });
  } catch (error) {
    handleError(error);
  }
};

const deleteParticipation = async () => {
  try {
    await withLoading(async () => {
      await request.delete(`/participations/${Number(participationDelete.wid)}/${Number(participationDelete.pid)}`);
      await fetchParticipations();
      setMessage('参与关系删除成功');
    });
  } catch (error) {
    handleError(error);
  }
};

onMounted(async () => {
  try {
    await refreshAll();
  } catch (error) {
    handleError(error);
  }
});
</script>

<template>
  <div class="page">
    <header class="header">
      <h1>企业管理系统（单页面）</h1>
      <button :disabled="loading" @click="refreshAll">刷新全部</button>
    </header>
    <p class="msg">{{ message }}</p>
    <section class="block">
      <h2>部门 Departments</h2>
      <p class="hint">新增表单中 <strong>*</strong> 为必填字段</p>
      <div class="op-row">
        <span class="op-label">按 id 查</span>
        <input v-model="departmentQueryDid" placeholder="did" type="number"/>
        <button :disabled="loading" @click="queryDepartment">查询</button>
      </div>
      <pre v-if="departmentQueryResult">{{ departmentQueryResult }}</pre>
      <div class="op-row">
        <span class="op-label">批量查</span>
        <button :disabled="loading" @click="refreshDepartments">查询全部</button>
      </div>
      <pre>{{ departments }}</pre>
      <div class="op-row">
        <span class="op-label">新增</span>
        <input v-model="departmentCreate.did" placeholder="did *" type="number" required/>
        <input v-model="departmentCreate.name" placeholder="name *" required/>
        <input v-model="departmentCreate.location" placeholder="location"/>
        <button :disabled="loading" @click="createDepartment">新增</button>
      </div>
      <div class="op-row">
        <span class="op-label">更新</span>
        <input v-model="departmentUpdate.did" placeholder="did" type="number"/>
        <input v-model="departmentUpdate.name" placeholder="name"/>
        <input v-model="departmentUpdate.location" placeholder="location"/>
        <button :disabled="loading" @click="updateDepartment">更新</button>
      </div>
      <div class="op-row">
        <span class="op-label">删除</span>
        <input v-model="departmentDeleteDid" placeholder="did" type="number"/>
        <button :disabled="loading" @click="deleteDepartment">删除</button>
      </div>
    </section>

    <section class="block">
      <h2>员工 Workers</h2>
      <p class="hint">新增表单中 <strong>*</strong> 为必填字段</p>
      <div class="op-row">
        <span class="op-label">按 id 查</span>
        <input v-model="workerQueryWid" placeholder="wid" type="number"/>
        <button :disabled="loading" @click="queryWorker">查询</button>
      </div>
      <pre v-if="workerQueryResult">{{ workerQueryResult }}</pre>
      <div class="op-row">
        <span class="op-label">批量查</span>
        <button :disabled="loading" @click="refreshWorkers">查询全部</button>
      </div>
      <pre>{{ workers }}</pre>
      <div class="op-row">
        <span class="op-label">新增</span>
        <input v-model="workerCreate.wid" placeholder="wid *" type="number" required/>
        <input v-model="workerCreate.name" placeholder="name *" required/>
        <input v-model="workerCreate.age" placeholder="age" type="number"/>
        <input v-model="workerCreate.gender" placeholder="gender"/>
        <input v-model="workerCreate.address" placeholder="address"/>
        <input v-model="workerCreate.email" placeholder="email"/>
        <input v-model="workerCreate.salary" placeholder="salary" type="number"/>
        <input v-model="workerCreate.did" placeholder="did" type="number"/>
        <button :disabled="loading" @click="createWorker">新增</button>
      </div>
      <div class="op-row">
        <span class="op-label">更新</span>
        <input v-model="workerUpdate.wid" placeholder="wid" type="number"/>
        <input v-model="workerUpdate.name" placeholder="name"/>
        <input v-model="workerUpdate.age" placeholder="age" type="number"/>
        <input v-model="workerUpdate.gender" placeholder="gender"/>
        <input v-model="workerUpdate.address" placeholder="address"/>
        <input v-model="workerUpdate.email" placeholder="email"/>
        <input v-model="workerUpdate.salary" placeholder="salary" type="number"/>
        <input v-model="workerUpdate.did" placeholder="did" type="number"/>
        <button :disabled="loading" @click="updateWorker">更新</button>
      </div>
      <div class="op-row">
        <span class="op-label">删除</span>
        <input v-model="workerDeleteWid" placeholder="wid" type="number"/>
        <button :disabled="loading" @click="deleteWorker">删除</button>
      </div>
    </section>

    <section class="block">
      <h2>项目 Projects</h2>
      <p class="hint">新增表单中 <strong>*</strong> 为必填字段</p>
      <div class="op-row">
        <span class="op-label">按 id 查</span>
        <input v-model="projectQueryPid" placeholder="pid" type="number"/>
        <button :disabled="loading" @click="queryProject">查询</button>
      </div>
      <pre v-if="projectQueryResult">{{ projectQueryResult }}</pre>
      <div class="op-row">
        <span class="op-label">批量查</span>
        <button :disabled="loading" @click="refreshProjects">查询全部</button>
      </div>
      <pre>{{ projects }}</pre>
      <div class="op-row">
        <span class="op-label">新增</span>
        <input v-model="projectCreate.pid" placeholder="pid *" type="number" required/>
        <input v-model="projectCreate.name" placeholder="name *" required/>
        <input v-model="projectCreate.status" placeholder="status *" required/>
        <input v-model="projectCreate.did" placeholder="did" type="number"/>
        <button :disabled="loading" @click="createProject">新增</button>
      </div>
      <div class="op-row">
        <span class="op-label">更新</span>
        <input v-model="projectUpdate.pid" placeholder="pid" type="number"/>
        <input v-model="projectUpdate.name" placeholder="name"/>
        <input v-model="projectUpdate.status" placeholder="status"/>
        <input v-model="projectUpdate.did" placeholder="did" type="number"/>
        <button :disabled="loading" @click="updateProject">更新</button>
      </div>
      <div class="op-row">
        <span class="op-label">删除</span>
        <input v-model="projectDeletePid" placeholder="pid" type="number"/>
        <button :disabled="loading" @click="deleteProject">删除</button>
      </div>
    </section>

    <section class="block">
      <h2>参与关系 Participations</h2>
      <p class="hint">新增表单中 <strong>*</strong> 为必填字段</p>
      <div class="op-row">
        <span class="op-label">按 id 查</span>
        <input v-model="participationQuery.wid" placeholder="wid" type="number"/>
        <input v-model="participationQuery.pid" placeholder="pid" type="number"/>
        <button :disabled="loading" @click="queryParticipation">查询</button>
      </div>
      <pre v-if="participationQueryResult">{{ participationQueryResult }}</pre>
      <div class="op-row">
        <span class="op-label">批量查</span>
        <button :disabled="loading" @click="refreshParticipations">查询全部</button>
      </div>
      <pre>{{ participations }}</pre>
      <div class="op-row">
        <span class="op-label">新增</span>
        <input v-model="participationCreate.wid" placeholder="wid *" type="number" required/>
        <input v-model="participationCreate.pid" placeholder="pid *" type="number" required/>
        <input v-model="participationCreate.role" placeholder="role"/>
        <input v-model="participationCreate.work_hour" placeholder="work_hour" type="number"/>
        <button :disabled="loading" @click="createParticipation">新增</button>
      </div>
      <div class="op-row">
        <span class="op-label">更新</span>
        <input v-model="participationUpdate.wid" placeholder="wid" type="number"/>
        <input v-model="participationUpdate.pid" placeholder="pid" type="number"/>
        <input v-model="participationUpdate.role" placeholder="role"/>
        <input v-model="participationUpdate.work_hour" placeholder="work_hour" type="number"/>
        <button :disabled="loading" @click="updateParticipation">更新</button>
      </div>
      <div class="op-row">
        <span class="op-label">删除</span>
        <input v-model="participationDelete.wid" placeholder="wid" type="number"/>
        <input v-model="participationDelete.pid" placeholder="pid" type="number"/>
        <button :disabled="loading" @click="deleteParticipation">删除</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.msg {
  min-height: 24px;
  margin-bottom: 12px;
  color: #444;
}

.block {
  border: 1px solid #ddd;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 6px;
}

.hint {
  margin: 6px 0 10px;
  color: #666;
  font-size: 13px;
}

.op-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.op-label {
  min-width: 72px;
  color: #333;
  font-weight: 600;
}

input {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 6px 10px;
  border: 1px solid #bbb;
  border-radius: 4px;
  background: #f2f2f2;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

pre {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
