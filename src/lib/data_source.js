// import { createClient } from '@supabase/supabase-js'
import { supabase, call_eage_function } from 'aonweb'
import { v4 as uuidv4 } from 'uuid';

// const APP_KEY = "dddad8fd-997c-4313-9024-52f1cc13e77d"

// const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZieHR2amZmaHNpcm55eGpjdWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI1MTY1NjQsImV4cCI6MjAzODA5MjU2NH0.E6SFFojKzIZCRIQAhoJ49aO4yY-m1Mb2sZtSkVh-tBg"

// const supabaseUrl = 'https://api.iaon.ai'
// const supabaseKey = API_KEY
// const supabase = createClient(supabaseUrl, supabaseKey)

let user = null

export async function bindMetaMask(signature, account) {
    return await call_eage_function('bindMetaMask', {
        signature,
        account
    })
}

export async function checkMetaMask(account, email) {
    return await call_eage_function('checkMetaMask', {
        account,
        email
    })
}


export async function signupWithEmail(email, password, options) {
    let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: options
        }
    })
    console.log('signupWithEmail = ', data, error)
    if (error) {
        throw error
    }
    return data
}

// signupWithEmail('liuxuzhong@ymyai.com','12345678')

export async function verifyEmail(email, code, type) {
    let { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: code,
        type: type
    })
    console.log('signupWithEmail = ', data, error)
    if (error) {
        throw error
    }
    return data
}
// verifyEmail('liuxuzhong@ymyai.com',"807850")

export async function loginWithEmail(email, password) {
    let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    if (error) {
        throw error
    }
    return data
}

// loginWithEmail('liuxuzhong@ymyai.com','12345678')

export async function logout() {
    let { error } = await supabase.auth.signOut()
    if (error) {
        throw error
    }
}

export async function resetPasswordForEmail(email, redirectTo) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
    })
    if (error) {
        throw error
    }
    return data
}

export async function resetPasswordConfirm(password) {
    const { data, error } = await supabase.auth.updateUser({
        password
    })
    console.log(data, error)
    if (error) {
        throw error
    }
    return data
}

// 是否为推荐应用 recommend （待补充）
export async function apps(page, size, filter) {
    page = page ? page : 1
    size = size ? size : 10
    let offset = (page - 1) * size
    size = offset + size - 1
    let select = supabase
        .from("app")
        .select("*")
        .neq('status', -1)
        .eq('recommend', 1)
        .is('deleted_at', null)
    if (filter && filter.category) {
        select = select.eq('category', filter.category)
    }
    if (filter && filter.keywords) {
        select = select.ilike('title', `%${filter.keywords}%`)
    }
    // 可以 添加 其他查询条件
    let { data, error } = await select.range(offset, size)
    console.log('apps = ', data, error)
    if (error) {
        throw error
    }
    return data
}
// app 总数 
export async function apps_total(filter) {
    let conditions = [{ field: 'status', operator: '!=', value: -1 }, { field: 'recommend', operator: '=', value: 1 }]
    if (filter && filter.category) {
        conditions.push({ field: 'category', operator: '=', value: filter.category })
    }

    if (filter && filter.keywords) {
        conditions.push({ field: 'title', operator: 'ilike', value: `%${filter.keywords}%` })
    }
    let data = await countDynamic('app', conditions)
    return data
}

// 开发者中心-my apps
export async function my_apps(user_id, page, size) {
    page = page ? page : 1
    size = size ? size : 10
    let offset = (page - 1) * size
    size = offset + size - 1
    let select = supabase
        .from("app")
        .select("*")
        .is('deleted_at', null)
        .eq("user_id", user_id)
        .neq('status', -1)
    let { data, error } = await select.range(offset, size)
    console.log('my_apps = ', data, error)
    if (error) {
        throw error
    }
    return data
}

export async function my_apps_byId(id) {
    let { data, error } = await supabase
        .from("app")
        .select('*,app_version(short_version,build_version,package_url)')
        .is('deleted_at', null)
        .eq("id", id)
    // .eq("app_version.app_key", id)
    console.log('my_apps_byId = ', data, error)
    if (error) {
        throw error
    }
    return data
}

export async function my_apps_version_byId(id) {
    let { data, error } = await supabase
        .from("app_version")
        .select('*')
        .is('deleted_at', null)
        .eq("app_key", id)
    console.log('my_apps_version_byId = ', data, error)
    if (error) {
        throw error
    }
    return data
}

// 根据多个或单个条件 对某个表的某个字段进行求和
const calculateSumDynamic = async (tableName, fieldName, conditions = []) => {
    const { data, error } = await supabase
        .rpc('calculate_sum_dynamic', {
            table_name: tableName,
            field_name: fieldName,
            conditions: conditions
        })

    if (error) {
        console.error('Error calculating sum:', error)
        return
    }

    console.log(`Sum of ${fieldName} in ${tableName} with conditions ${JSON.stringify(conditions)}:`, data)

    return data
}

//   根据单个或多个条件 对某个表进行count
const countDynamic = async (tableName, conditions = []) => {
    const { data, error } = await supabase
        .rpc('count_dynamic', {
            table_name: tableName,
            conditions: conditions
        })

    if (error) {
        console.error('Error counting records:', error)
        return
    }

    console.log(`Count of records in ${tableName} with conditions ${JSON.stringify(conditions)}:`, data)
    return data
}

// 根据日期和app_keys 查询访问量
const calculateVisitCount = async (day, appKeys = null) => {
    const { data, error } = await supabase
        .rpc('calculate_visit_count', {
            day_param: day, // 使用 day_param 作为参数名称
            app_keys: appKeys
        });

    if (error) {
        console.error('Error fetching visit count:', error);
        return;
    }

    console.log(`Total visit count for specified app_keys on ${day}:`, data);
    return data
};

//   开发者中心 - 我的app 总数
export async function my_apps_total(user_id) {
    let conditions = [{ field: 'deleted_at', operator: 'is', value: null }]
    if (user_id) {
        conditions.push({ field: 'user_id', operator: '=', value: user_id })
        conditions.push({ field: 'status', operator: '!=', value: -1 })
    }
    let data = await countDynamic('app', conditions)
    return data
}

// my_apps_total()

//   开发者中心 - total visit
export async function total_visit(user_id) {
    let conditions = []
    if (user_id) {
        conditions.push({ field: 'user_id', value: user_id })
    }
    // 根据 user_id 查app表里的visit_count 的和
    let data = await calculateSumDynamic('app', 'visit_count', conditions)
    return data
}

// total_visit()

//   开发者中心 - yesterday visit
export async function yesterday_visit(user_id) {
    // 获取当前日期
    const today = new Date();

    // 创建一个新的日期对象表示昨天
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // 格式化为字符串（可选）
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedYesterday = yesterday.toLocaleDateString(undefined, options);

    console.log(`昨天的日期是：${formattedYesterday}`);


    let select = supabase
        .from("app")
        .select("*")
        .is('deleted_at', null)
    if (user_id) {
        select = select.eq("user_id", user_id)
    }
    let { data, error } = await select
    if (error) {
        console.error('Error yestoday_visit count:', error);
        return
    }
    console.log('yestoday_visit apps:', data);
    let app_keys = []
    for (let i = 0; i < data.length; i++) {
        let app = data[i]
        app_keys.push(app.id)
    }



    let data_count = await calculateVisitCount(formattedYesterday, app_keys)
    return data_count
}

// yesterday_visit()

//   开发者中心 - computility_consumption
export async function computility_consumption(user_id) {
    let conditions = []
    if (user_id) {
        conditions.push({ field: 'user_id', value: user_id })
    }
    let data = await calculateSumDynamic('app', 'computility_point', conditions)
    return data
}


// 根据id查询app 暂未用到
export async function app(id) {
    let { data, error } = await supabase
        .from("app")
        .select("*")
        .is('deleted_at', null)
        .eq("id", id)
    console.log('app = ', data, error)
    if (error) {
        throw error
    }
    return data
}

// 上传app 有ID 编辑  无ID 新增
export async function updateApp(app) {
    if (!app) throw new Error('app is required');
    app.status = 5
    if (!app.id) {
        console.log('updateApp = ', 'insert')
        const { data, error } = await supabase
            .from('app')
            .insert([
                app
            ])
            .select()
        console.log('updateApp = ', 'insert', data, error)
        if (error) {
            console.error(error)
            return
        }
        return data
    }
    console.log('updateApp = ', 'update')
    const { data, error } = await supabase
        .from('app')
        .update(app)
        .eq('id', app.id)
        .select()
    console.log('updateApp = ', 'update', data, error)
    if (error) {
        console.error(error)
        return
    }
    return data
}

export async function updateAppVersion(params) {
    if (!params.id) {
        const { data, error } = await supabase
            .from('app_version')
            .insert([
                params
            ])
            .select()
        console.log('updateAppVersion = ', 'insert', data, error)
        if (error) {
            throw error
        }
        return data
    }
}

// models 总数 
export async function models_total(filter) {
    let conditions = [{ field: 'publish_status', operator: '>=', value: 0 }]
    if (filter && filter.category) {
        conditions.push({ field: 'category', operator: '=', value: filter.category })
    }
    if (filter && filter.keywords) {
        conditions.push({ field: 'name', operator: 'like', value: `%${filter.keywords}%` })
    }
    let data = await countDynamic('model', conditions)
    return data
}

export async function collect(model_id, user_id) {
    console.log(model_id, user_id)
    if (model_id && user_id) {
        console.log('collect = ', 'insert')
        const { data, error } = await supabase
            .from('collect_model')
            .insert([
                { model_id, user_id }
            ])
            .select()
        console.log('collect = ', 'insert', data, error)
        if (error) {
            console.error(error)
            throw error
        }
        return data
    }

    return null
}

export async function collect_cancel(model_id, user_id) {
    if (model_id && user_id) {
        console.log('collect = ', 'insert')
        const { data, error } = await supabase
            .from('collect_model')
            .update({ deleted_at: new Date().toISOString() })
            .eq('model_id', model_id)
            .eq('user_id', user_id)
            .select()
        console.log('collect = ', 'insert', data, error)
        if (error) {
            console.error(error)
            throw error
        }
        return data
    }

    return null
}

export async function changeAppsStatus(app_id, user_id, status) {
    if (app_id && user_id) {
        const { data, error } = await supabase
            .from('app')
            .update({ status: status })
            .eq('id', app_id)
            .eq('user_id', user_id)
            .select()
        console.log('app = ', 'update', data, error)
        if (error) {
            console.error(error)
            throw error
        }
        return data
    }

    return null
}

export async function getUserAsset(user_id) {
    if (user_id) {
        const { data, error } = await supabase
            .from('user_asset')
            .select("*")
            .eq('user_id', user_id)
        if (error) {
            console.error(error)
            throw error
        }
        return data
    }

    return null
}

export async function is_collect(model_id, user_id) {
    if (model_id && user_id) {
        const { data, error } = await supabase
            .from('collect_model')
            .select("*")
            .is('deleted_at', null)
            .eq('model_id', model_id)
            .eq('user_id', user_id)
        console.log('is_collect = ', data, error)
        if (error) {
            console.error(error)
            throw error
        }
        return data
    }

    return null
}

// models_total()
// 模型列表
export async function models(page, size, filter) {
    page = page ? page : 1
    size = size ? size : 10
    let offset = (page - 1) * size
    size = offset + size - 1
    let select = supabase
        .from("model")
        .select("*")
        .order('sort', { ascending: false })
        .order('created_at', { ascending: false })
        .is('deleted_at', null)
        // .gt('publish_status', 0)
        .gte('publish_status', 0)
    console.log(filter)
    if (filter && filter.category) {
        select = select.eq('category', filter.category)
    }
    if (filter && filter.keywords) {
        select = select.ilike('name', `%${filter.keywords}%`)
    }
    //可以添加其他查询条件

    let { data, error } = await select.range(offset, size)
    console.log('models = ', data, error)
    if (error) {
        throw error
    }
    return data
}

// 根据id 查模型
export async function model(name) {
    let { data, error } = await supabase
        .from("model")
        .select("*")
        .is('deleted_at', null)
        .eq("name", name)
    console.log('model = ', data, error)
    if (error) {
        throw error
    }
    return data
}

// 查询模型分类
export async function categorys() {
    let { data, error } = await supabase
        .from("category")
        .select("*")
        .is('deleted_at', null)
    console.log('categorys = ', data, error)
    if (error) {
        throw error
    }
    return data
}

export async function checkSession() {
    try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
            console.log('getSession error:', error)
            return null
        } else if (!data.session) {
            return null
        } else {
            console.log('getSession success:', data)
            return data.session
        }
    } catch (error) {
        console.log('checkSession error:', error.message)
        return null
    } finally {
    }
}

export async function getUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            throw error
        }
        return user
    } catch (error) {
        console.log('getUser error:', error)
        return null
    }
}

export async function getProfiles(userId) {
    try {
        let { data: profiles } = await supabase.from("profiles").select("*").eq('id', userId)
        profiles = profiles && profiles.length && profiles[0]
        return profiles
    } catch (error) {
        console.log('getProfiles error:', error)
        return null
    }
}



export async function linkTwitter(redirectTo) {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
            redirectTo,
        }
    })
    console.log(data, error)
}
export async function linkGithub(redirectTo) {
    // const { data, error } = await supabase.auth.linkIdentity({ provider: 'github' })
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo,
        }
    })
    console.log(data, error)
}
export async function linkGoogle(redirectTo) {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo,
        }
    })
    console.log(data, error)
}



export async function upload_app_resource(filename, file, storageName) {
    try {
        const { data, error } = await supabase
            .storage
            .from(storageName ? storageName : 'app_resource')
            .upload(filename, file, {
                cacheControl: '3600',
                upsert: false,
                // contentType: 'image/png'
            })
        if (error) {
            throw error
        }
        console.log(data)
        if (data) {
            const { data, error } = await supabase.storage
                .from(storageName ? storageName : 'app_resource')
                .getPublicUrl(filename)
            if (error) {
                throw error
            }
            console.log('publicURL = ', data.publicUrl)
            return data.publicUrl
        }

        return null
    } catch (error) {
        console.log('upload_app_icon error:', error)
        return error
    }
}

export async function check_name_exsit(name, app_id) {
    let conditions = [{ field: 'name', operator: '=', value: name }, { field: 'id', operator: '!=', value: app_id }]
    let data = await countDynamic('app', conditions)
    return data
}


